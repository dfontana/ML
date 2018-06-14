export default interface Genome {
  fitness: number;
  evaluate(): void;
  toString(): string;
}