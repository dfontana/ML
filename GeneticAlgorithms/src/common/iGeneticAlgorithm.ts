import Genome from "./iGenome"
import Gene from "./iGene"

export default interface GeneticAlgorithm {
  fittest: Genome;
  generation: number;
  initPool(genes: Gene[], tableCt: number, tableCap: number): Promise<Genome[]>;
  breed(pool: Genome[]): Promise<Genome[]>;
  evaluate(pool: Genome[]): Promise<void>;
}