export default interface Genome {
  fitness: number;
  evaluate(): void;
  cross(other: Genome): Genome[];
  mutate(): Genome;
  toString(): string;
}