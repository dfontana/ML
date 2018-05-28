/**
 * Goal: Find tables where:
 *  - people who should sit next to each other are
 *  - people who shouldn't be at the same table, aren't
 *  - tables are more filled (TODO: based on percent capacity currently, but 3 x 10% = 1 x 30%...)
 */
let PERSON_ID = 0;
class Person {
  constructor(name) {
    this.relations = []
    this.blacklst = [];
    this.name = name;
    this.id = PERSON_ID++;
  }

  relationWith(person) {
    this.relations.push(person);
  }

  blacklist(person) {
    this.blacklst.push(person);
  }

  /**
   * Returns the count of unmet relations this person has based on the given
   * neighbors.
   */
  relationsUnmet(neighbors) {
    return this.relations.reduce((acc, person) => {
      if(neighbors.filter(m => m.is(person)).length === 0) {
        acc += 1
      }
      return acc;
    }, 0)
  }

  /**
   * Returns the count of blacklisted people found in the list of people
   * given.
   */
  blacklistsUnmet(people) {
    return this.blacklist.reduce(
      (acc, person) => acc + people.filter(m => m.is(person)).length,
      0
    )
  }

  is(person) {
    return this.id === person.id;
  }

  toString() {
    return this.name;
  }
}

class Table {
  constructor(id, size) {
    this.id = id;
    this.capacity = size;
    this.seats = {};
    for(let i = 0; i < size; i++){
      seats[i] = null;
    }
  }

  /**
   * Places the given person at the next seat in this table. If the table is full,
   * false is returned - otherwise true.
   * @param {Int} personID ID of person to be seated
   * @return True if the person was successfully seated.
   */
  async seat(person, seatNum) {
    if(this.nextSeat >= this.capacity-1 || this.seats[seatNum] !== null) {
      return false;
    }
    this.seats[seatNum] = person;
    return true;
  }

  /**
   * returns percentage of table filled
   */
  percentage() {
    let size = Object.values(this.seats).filter(m => m !== null).length
    return Math.floor(size / this.capacity)
  }

  /**
   * Returns count of blacklist violations for all people at the table. 
   * Will be double counted if the violation is mutual.
   */
  blacklistViolations() {
    let atTable = Object.values(this.seats).filter(m => m !== null);
    let persons = Object.values(seats);
    return persons.reduce((acc, person) => {
      return acc + person.blacklistsUnmet(atTable);
    }, 0)
  }

  /**
   * Returns count of relationships violated. Will double count if
   * relationship is mutual.
   */
  relationshipViolations() {
    let persons = Object.values(seats);
    return persons.reduce((acc, person) => {
      // Get their neighbors, for relationship checking
      let neighbors = [];
      switch(seat){
        case 0:
          // Check 'top' of table
          neighbors.push([this.seats[1], this.seats[this.capacity-1]])
          break;
        case this.capacity-1:
          // Check 'bottom' of table
          neighbors.push([this.seats[0], this.seats[seat-1]])
          break;
        default:
          neighbors.push([this.seats[seat-1], this.seats[seat+1]])
      }

      return acc + person.relationsUnmet(neighbors);
    }, 0);
  }

  toString() {
    let s = "";
    let people = Object.values(this.seats).filter(m => m !== null);
    for(let i = 0; i < people.length; i++) {
      s += `${people[i].toString()}${i === people.length-1 ? '' : '-'}`;
    }
    return s;
  }
}

class Layout {
  constructor() {
    this.tables = {};
    this.nextTblId = 0;
    this.fitness = 0;
  }

  addTable(capacity) {
    this.tables[this.nextTblId] = new Table(this.nextTblId++, capacity);
  }

  seat(person, tableID, seatID) {
    return this.tables[tableID].seat(person, seatID);
  }

  evaluate() {
    this.fitness = Object.values(this.tables).reduce((acc, t) => {
      let tScore = 0;
      tScore -= t.relationshipViolations() * 100;
      tScore -= t.blacklistViolations() * 100;
      tScore += t.percentage() * 100;
      return acc + tScore;
    }, 0);
  }

  toString() {
    let s = "";
    for(let table in this.tables) {
      s += `${table}: ${this.tables[table].toString()}\n`
    }
    return s;
  }
}

class GATable {
  constructor(attendees, poolSize, crossP, mutateP) {
    this.ps = poolSize;
    this.cp = crossP;
    this.mp = mutateP;
    this.genes = attendees;
    this.generation = 0;
  }

  /**
   * Initialize layouts of tables with everyone randomly seated. This
   * generation will then be evaluation and the best layout stored.
   * @param {Int} tableCt Number of tables
   * @param {Int} tableCap Capacity of each table
   */
  async initPool(tableCt, tableCap) {
    if(tableCt * tableCap < attendees.length) {
      throw new Error(`Not enough seats (${tableCt*tableCap}) available for the number of attendees (${attendees.length}).`)
    }

    this.pool = [];
    for(let i = 0; i < this.ps; i++) {
      // Initialize empty tables (pool)
      let layout = new Layout();
      for(let i = 0; i<tableCt; i++) {
        layout.addTable(tableCap);
      }

      // Seat attendees at a random table and seat number.
      this.genes.map((a) => {
        let tbl = 0, seat = 0, seated = false;
        do{
          tbl = Math.floor(Math.random()*tableCt);
          seat = Math.floor(Math.random()*tableCap);
          seated = await layout.seat(a, tbl, seat)
        }while(!seated)
      })

      // Add layout to pool.
      this.pool.push(layout)
    }

    await this.evaluate();
    await this.fittest();
  }

  async evaluate() {
    this.pool.map(l => l.evaluate())
    this.totalFitness = this.pool.reduce((acc, x) => acc + x.fitness, 0)
  }

  async fittest() {
    this.best = this.pool.reduce((acc, layout) => {
      if(layout.fitness > acc.fitness) {
        acc = layout;
      }
      return acc;
    }, {fitness: Number.MIN_SAFE_INTEGER})
  }

  /**
   * Randomly chooses a genome from the pool based on its proportional fitness.
   * @return genome, randomly selected
   */
  async roulette() {
    let sum = 0;
    let threshold = this.totalFitness * Math.random();
    for(let i = 0; i < this.pool.length; i++) {
      sum += this.pool[i].fitness
      if(sum >= threshold) {
        return this.pool[i];
      }
    }
  }

  /**
   * Selects (1-P_CROSSOVER)*POOL_SIZE genomes to be carried on into the next generation without any crossover.
   * @return Array of genomes to be carried into next generation.
   */
  async survivors() {
    let n = (1 - this.cp) * this.ps;
    return Array.from({length: n}, x => this.roulette())
  }

  /**
   * Selects n parents from the given pool for crossover. 
   * @return Array of objects, holding two genomes each.
   */
  async parents() {
    let n = this.cp * this.ps;
    return Array.from({length: n}, x => [roulette(), roulette()])
  }

  /**
   * TODO
   * Performs single-point crossover on each of the parental pairs provided, returning a flat list of genomes to include in the next generation.
   * @param {Array} parents List of objects containing two parents for crossing over.
   * @return Array of genomes bred from parents.
   */
  async crossover(parents) {
    function cross(pair) {
      let [p1, p2] = pair;
      let point = Math.random()*p1.length
      let c1 = p1.substring(0, point) + p2.substring(point);
      let c2 = p2.substring(0, point) + p1.substring(point);
      return [c1, c2]
    }
    return parents.reduce((acc, pair) => {
      acc.push(...cross(pair))
      return acc
    }, [])
  }

  /**
   * TODO
   * Performs mutation over the given pool with the given probability.
   * In this version, mutation is attempted on each gene of each genome within the pool.
   * of a random genome to mutate.
   * @return Genome pool after mutation
   */
  async mutate() {
    return pool.map(g => {
    for(let i = 0; i < g.length; i++) {
      if(g[i] != goal[i] && Math.random() <= prob) {
        g = g.substr(0, i) + randChar() + g.substr(i+1);
      }
    }
    return g
    })
  }

  async evolve() {
    let survivors = await this.survivors()
    let parents = await this.parents()
    let children = await crossover(parents)
    this.pool = [...survivors, ...children]
    await this.mutate()
    await this.evaluate()
    await this.fittest()
  }
}

// ============ Evolution loop.
let GA = new GATable(getPeople(), 200, 0.95, 0.01);
GA.init(5, 4);
while(GA.generation < 2000) {
  GA.evolve()
  console.log(`Gen: ${GA.generation} Fit: ${GA.best.fitness}`)
}
console.log(`\n Best Layout: ${GA.best.fitness} \n ============ \n ${GA.best.layout.toString()}`)

// ============= People construction
var getPeople = () => {
  let attendees = {
    'Kurt' : new Person('Kurt'),
    'Jane' : new Person('Jane'),
    'Edgar' : new Person('Edgar'),
    'Tasha' : new Person('Tasha'),
    'Patterson' : new Person('Patterson'),
    'Roman' : new Person('Roman'),
    'Shepherd' : new Person('Sheperd'),
    'Borden' : new Person('Borden'),
    'Rich' : new Person('Rich'),
    'Nas' : new Person('Nas'),
    'Keaton' : new Person('Keaton'),
    'Cade' : new Person('Cade')
  }
  
  let link = (n1, n2) => {
    attendees[n1].relationWith(attendees[n2]) 
    attendees[n2].relationWith(attendees[n1]) 
  }
  
  let avoid = (n1, list) => {
    for(let i = 0; i < list.length; i++){
      attendees[n1].blacklist(attendees[list[i]])
    }
  }
  
  let bad = ['Roman', 'Shepherd', 'Borden', 'Cade']
  link('Kurt', 'Jane')
  link('Tasha', 'Edgar')
  link('Rich', 'Patterson')
  link('Keaton', 'Nas')
  avoid('Kurt', bad)
  avoid('Jane', bad)
  avoid('Tasha', bad)
  avoid('Edgar', bad)
  avoid('Patterson', bad)
  avoid('Nas', bad)
  
  return Object.values(attendees);
}