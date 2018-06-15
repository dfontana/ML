import Genome from "./iGenome"
import Gene from "./iGene"

export default interface GeneticAlgorithm {
  fittest: Genome;
  generation: number;
  initPool(genes: Gene[]): Genome[];
  breed(pool: Genome[]): Genome[];
  evaluate(pool: Genome[]): void;
  isFinished(): boolean;
}