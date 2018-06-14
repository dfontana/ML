import Gene from "../common/iGene"

let PERSON_ID: number = 0;

export default class Person implements Gene{
  private nextTo: Set<Person>;
  private blacklist: Set<Person>;
  name: string;
  id: number;

  constructor(name: string) {
    this.nextTo = new Set();
    this.blacklist = new Set();
    this.name = name;
    this.id = PERSON_ID++;
  }

  sitsNextTo(person: Person): void {
    this.nextTo.add(person);
  }

  notAtTableWith(person: Person): void {
    this.blacklist.add(person);
  }

  // Number of people who should be a neighbor of this person, but aren't.
  relationsUnmet(neighbors: Set<Person>): number {
    return [...this.nextTo].filter(person => neighbors.has(person)).length;
  }

  // Number of people at the table with this person, who shouldn't be.
  blacklistsUnmet(people: Person[]): number {
    let b: Set<Person> = new Set(people); //TODO replace people with set
    return [...this.blacklist].filter(person => b.has(person)).length;
  }

  is(person: Person): boolean {
    return this.id === person.id;
  }

  toString(): string {
    return this.name;
  }
}