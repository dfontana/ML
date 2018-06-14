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