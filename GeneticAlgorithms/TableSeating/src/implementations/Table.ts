import Person from "./Person"

export default class Table {
  private id: number;
  seated: Person[];

  constructor(id: number, size: number) {
    this.id = id;
    this.seated = new Array(size); // Index = Seat# of person
  }

  /**
   * Seats person at the given seat in this table, if unoccupied.
   * @param {Int} personID ID of person to be seated
   * @return True if the person was successfully seated.
   */
  seat(person: Person, seatNum: number): boolean {
    if(this.seated[seatNum] !== null) {
      return false;
    }
    this.seated[seatNum] = person;
    return true;
  }

  // Returns percentage of table filled
  percentage(): number {
    let size: number = this.seated.filter(m => m !== null).length
    return Math.floor(size / this.seated.length)
  }

  /**
   * Returns count of blacklist violations for all people at the table. 
   * Will be double counted if the violation is mutual.
   */
  blacklistViolations(): number {
    let atTable: Person[] = this.seated.filter(m => m !== null);
    return this.seated.reduce((acc, person) => {
      return acc + person.blacklistsUnmet(atTable);
    }, 0)
  }

  /**
   * Returns count of relationships violated. Will double count if
   * relationship is mutual.
   */
  relationshipViolations(): number {
    return this.seated.reduce((acc: number, person: Person, seatNum: number) => {
      // Get their neighbors, for relationship checking
      let neighbors: Set<Person> = new Set();
      switch(seatNum){
        case 0:
          // Check 'top' of table
          neighbors.add(this.seated[1]);
          neighbors.add(this.seated[this.seated.length-1]);
          break;
        case this.seated.length-1:
          // Check 'bottom' of table
          neighbors.add(this.seated[0]);
          neighbors.add(this.seated[seatNum-1]);
          break;
        default:
          neighbors.add(this.seated[seatNum+1]);
          neighbors.add(this.seated[seatNum-1]);
      }

      return acc + person.relationsUnmet(neighbors);
    }, 0);
  }

  toString(): string {
    let s = "";
    let people = this.seated.filter(m => m !== null);
    for(let i = 0; i < people.length; i++) {
      s += `${people[i].toString()}${i === people.length-1 ? '' : '-'}`;
    }
    return s;
  }
}