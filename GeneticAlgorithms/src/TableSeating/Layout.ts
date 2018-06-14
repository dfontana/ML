import Genome from "../common/iGenome"
import Table from "./Table"
import Person from "./Person"

export default class Layout implements Genome{
  private tables: Table[];
  private nextTblId: number;
  fitness: number;

  constructor() {
    this.tables = [];
    this.nextTblId = 0;
    this.fitness = 0;
  }

  addTable(capacity: number): void {
    this.tables.push(new Table(this.nextTblId++, capacity));
  }

  // Seats the given person in seat at table, returning if it was successful.
  async seat(person: Person, tableID: number, seatID: number): Promise<boolean> {
    if(this.tables.length-1 < tableID) {
      return false;
    }
    return this.tables[tableID].seat(person, seatID);
  }

  evaluate(): void {
    this.fitness = this.tables.reduce((acc: number, t: Table) => {
      let tScore: number = 0;
      tScore -= t.relationshipViolations() * 100;
      tScore -= t.blacklistViolations() * 100;
      tScore += t.percentage() * 100;
      return acc + tScore;
    }, 0);
  }

  //TODO
  cross(other: Layout): Genome[] {
    let [p1, p2] = pair;
    let point = Math.random()*p1.length
    let c1 = p1.substring(0, point) + p2.substring(point);
    let c2 = p2.substring(0, point) + p1.substring(point);
    return [c1, c2]
  }

  //TODO
  mutate(): Genome {
    // g == this genome, should return a mutated form of this genome
    for(let i = 0; i < g.length; i++) {
      if(g[i] != goal[i] && Math.random() <= prob) {
        g = g.substr(0, i) + randChar() + g.substr(i+1);
      }
    }
    return g
  }

  toString() {
    let s = "";
    for(let table in this.tables) {
      s += `${table}: ${this.tables[table].toString()}\n`
    }
    return s;
  }
}