import Layout from "./Layout"
import Person from "./Person"
import GeneticAlgorithm from "../interfaces/iGeneticAlgorithm"
import Genome from "../interfaces/iGenome"
import { fittest, findParents, findSurvivors } from "./GAUtilities"


/**
 * TODO
 * Performs single-point crossover on each of the parental pairs provided, returning a flat list of genomes to include in the next generation.
 * @param parents List of objects containing two parents for crossing over.
 * @return Array of genomes bred from parents.
 */
async function crossover(parents: Genome[][]) {
  function cross(pair: Genome[]) {
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
async function mutate(pool: Genome[]): Promise<Genome[]> {
  return pool.map(g => {
  for(let i = 0; i < g.length; i++) {
    if(g[i] != goal[i] && Math.random() <= prob) {
      g = g.substr(0, i) + randChar() + g.substr(i+1);
    }
  }
  return g
  })
}

export default class GATable implements GeneticAlgorithm{
  private cp: number;
  private mp: number;
  private genes: Person[];
  private poolSize: number;
  generation: number;
  fittest: Genome;

  constructor(poolSize: number, crossP: number, mutateP: number) {
    this.cp = crossP;
    this.mp = mutateP;
    this.generation = 0;
    this.poolSize = poolSize;
  }

  /**
   * Initialize layouts of tables with everyone randomly seated. This
   * generation will then be evaluation and the best layout stored.
   * @param tableCt Number of tables
   * @param tableCap Capacity of each table
   */
  async initPool(attendees: Person[], tableCt: number, tableCap: number): Promise<Genome[]> { 

    // Set the genes (people), assuming it's appropriately sized.
    if(tableCt * tableCap < attendees.length) {
      throw new Error(`Not enough seats (${tableCt*tableCap}) available for the number of attendees (${attendees.length}).`)
    }
    this.genes = attendees;

    let pool = new Array(this.poolSize);

    // Build pool of layouts
    for(let i = 0; i < pool.length; i++) {
      // Initialize empty tables (pool)
      let layout = new Layout();
      for(let i = 0; i<tableCt; i++) {
        layout.addTable(tableCap);
      }

      // Seat attendees at a random table and seat number.
      for(let i = 0; i < this.genes.length; i++) {
        let person: Person = this.genes[i];
        let tbl = 0, seat = 0, seated = false;
        do{
          tbl = Math.floor(Math.random()*tableCt);
          seat = Math.floor(Math.random()*tableCap);
          seated = await layout.seat(person, tbl, seat)
        }while(!seated)
      }

      // Add layout to pool.
      pool.push(layout)
    }

    return pool;
  }

  async evaluate(pool: Genome[]): Promise<void> {
    pool.map(l => l.evaluate())
    this.fittest = await fittest(pool);
  }

  async breed(pool: Genome[]): Promise<Genome[]> {
    let survivors = await findSurvivors(pool, this.cp)
    let parents = await findParents(pool, this.cp)
    let children = await crossover(parents)
    return mutate([...survivors, ...children]);
  }
}