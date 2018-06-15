import Gene from "../common/iGene"

export default class Character implements Gene {
  private val: string;
  constructor(character: string) {
    this.val = character;
  }
  toString(): string {
    return this.val;
  } 
  equals(other: Character): boolean {
    return this.val === other.val;
  }
}