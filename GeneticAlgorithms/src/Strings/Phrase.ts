import Genome from "../common/iGenome"
import Character from "./Character"

export default class Phrase implements Genome {
  fitness: number;
  str: Character[];

  private goal: Phrase;

  constructor(characters: Character[], goal?: Phrase) {
    this.fitness = 0;
    this.str = characters;
    this.goal = goal
  }

  evaluate(goal: Phrase): void {
    this.fitness = this.str.reduce((acc, char, i) => {
      let match = (char.equals(goal.str[i]) ? 1 : 0)
      return (acc + match)
    }, 0)
  }

  cross(other: Phrase): Phrase[] {
    let point = Math.random()*this.str.length
    let c1 = [...this.str.slice(0, point), ...other.str.slice(point)];
    let c2 = [...other.str.slice(0, point), ...this.str.slice(point)];
    return [new Phrase(c1, this.goal), new Phrase(c2, this.goal)]
  }

  mutate(prob: number, randGene: Function): Genome {
    for(let i = 0; i < this.str.length; i++) {
      if(!this.str[i].equals(this.goal.str[i]) && Math.random() <= prob) {
        this.str[i] = randGene()
      }
    }
    return this;
  }

  toString(): string {
    return this.str.map(c => c.toString()).join('');
  }
}