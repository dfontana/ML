import GeneticAlgorithm from "../common/iGeneticAlgorithm";
import Genome from "../common/iGenome";
import Character from "./Character"
import Phrase from "./Phrase"
import { fittest, findParents, findSurvivors, crossover, mutate } from "../common/GAUtilities"

export default class GAString implements GeneticAlgorithm {
  private cp: number;
  private mp: number;
  private poolSize: number;
  private genes: Character[];
  private goal: Phrase;
  private threshold: number;
  private randGene: Function;
  fittest: Genome;
  generation: number;

  constructor(poolSize: number, crossP: number, mutateP: number, goal: string, threshold: number) {
    this.cp = crossP;
    this.mp = mutateP;
    this.generation = 0;
    this.poolSize = poolSize;
    this.goal = new Phrase([...goal].map(c => new Character(c)));
    this.threshold = threshold;
  }

  initPool(genes: Character[]): Genome[] {
    this.genes = genes;
    this.randGene = () => this.genes[Math.floor(Math.random()*this.genes.length)]
    const randomGenome = (): Phrase => {
      return new Phrase(Array.from({length: this.goal.toString().length}, x => this.randGene()), this.goal)
    }
    return Array.from({length: this.poolSize}, x => randomGenome())
  }

  breed(pool: Genome[]): Genome[] {
    this.generation++;
    let survivors = findSurvivors(pool, (1-this.cp)*this.poolSize)
    let parents = findParents(pool, this.cp*this.poolSize)
    let children = crossover(parents)
    return mutate([...survivors, ...children], this.mp, this.randGene);
  }

  evaluate(pool: Genome[]): void{ 
    pool.map(l => l.evaluate(this.goal))
    this.fittest = fittest(pool);
  }

  isFinished(): boolean {
    return (this.fittest || {fitness:0}).fitness/this.goal.toString().length >= this.threshold;
  }
}