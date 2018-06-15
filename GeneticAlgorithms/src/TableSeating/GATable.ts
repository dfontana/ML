import Layout from "./Layout"
import Person from "./Person"
import GeneticAlgorithm from "../common/iGeneticAlgorithm"
import Genome from "../common/iGenome"
import { fittest, findParents, findSurvivors, crossover, mutate } from "../common/GAUtilities"

export default class GATable implements GeneticAlgorithm{
  private cp: number;
  private mp: number;
  private genes: Person[];
  private poolSize: number;
  private tableCt: number;
  private tableCap: number;
  private generations: number;
  generation: number;
  fittest: Genome;

  constructor(generations: number, poolSize: number, crossP: number, mutateP: number, tableCt: number, tableCap: number) {
    this.cp = crossP;
    this.mp = mutateP;
    this.generation = 0;
    this.poolSize = poolSize;
    this.tableCt = tableCt;
    this.tableCap = tableCap;
    this.generations = generations;
  }

  /**
   * Initialize layouts of tables with everyone randomly seated. This
   * generation will then be evaluation and the best layout stored.
   * @param tableCt Number of tables
   * @param tableCap Capacity of each table
   */
  initPool(attendees: Person[]): Genome[] { 

    // Set the genes (people), assuming it's appropriately sized.
    if(this.tableCt * this.tableCap < attendees.length) {
      throw new Error(`Not enough seats (${this.tableCt*this.tableCap}) available for the number of attendees (${attendees.length}).`)
    }
    this.genes = attendees;

    let pool = new Array(this.poolSize);

    // Build pool of layouts
    for(let i = 0; i < pool.length; i++) {
      // Initialize empty tables (pool)
      let layout = new Layout();
      for(let i = 0; i<this.tableCt; i++) {
        layout.addTable(this.tableCap);
      }

      // Seat attendees at a random table and seat number.
      for(let i = 0; i < this.genes.length; i++) {
        let person: Person = this.genes[i];
        let tbl = 0, seat = 0, seated = false;
        do{
          tbl = Math.floor(Math.random()*this.tableCt);
          seat = Math.floor(Math.random()*this.tableCap);
          seated = layout.seat(person, tbl, seat)
        }while(!seated)
      }

      // Add layout to pool.
      pool.push(layout)
    }

    return pool;
  }

  evaluate(pool: Genome[]): void {
    pool.map(l => l.evaluate())
    this.fittest = fittest(pool);
  }

  breed(pool: Genome[]): Genome[] {
    this.generation++;
    let survivors = findSurvivors(pool, (1-this.cp)*this.poolSize)
    let parents = findParents(pool, this.cp*this.poolSize)
    let children = crossover(parents)
    return mutate([...survivors, ...children], this.mp, ()=>{});
  }

  isFinished(): boolean {
    return this.generation < this.generations;
  }
}