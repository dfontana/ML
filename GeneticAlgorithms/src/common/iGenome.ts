export default interface Genome {
  fitness: number;
  evaluate(goal?: Genome): void;
  cross(other: Genome): Genome[];
  mutate(mutateProbability: number, randGene: Function): Genome;
  toString(): string;
}