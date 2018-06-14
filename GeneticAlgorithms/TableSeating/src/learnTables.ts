import GATable from "./implementations/GATable"
import Person from "./implementations/Person"
import GeneticAlgorithm from "./interfaces/iGeneticAlgorithm"


// ============ Evolution loop.
(async function Evolution(){
  let GA: GeneticAlgorithm = new GATable(200, 0.95, 0.01);
  let pool = await GA.initPool(getPeople(), 5, 4);
  while(GA.generation < 2000) {
    pool = await GA.breed(pool);
    await GA.evaluate(pool);
    console.log(`Gen: ${GA.generation} Fit: ${GA.fittest.fitness}`)
  }
  console.log(`\n Best Layout: ${GA.fittest.fitness} \n ============ \n ${GA.fittest.toString()}`)
})();

// ============= People construction
function getPeople() {
  let attendees: {[index:string]:Person} = {
    'Kurt' : new Person('Kurt'),
    'Jane' : new Person('Jane'),
    'Edgar' : new Person('Edgar'),
    'Tasha' : new Person('Tasha'),
    'Patterson' : new Person('Patterson'),
    'Roman' : new Person('Roman'),
    'Shepherd' : new Person('Sheperd'),
    'Borden' : new Person('Borden'),
    'Rich' : new Person('Rich'),
    'Nas' : new Person('Nas'),
    'Keaton' : new Person('Keaton'),
    'Cade' : new Person('Cade')
  }
  
  function link(n1: string, n2: string){
    attendees[n1].sitsNextTo(attendees[n2]) 
    attendees[n2].sitsNextTo(attendees[n1]) 
  }
  
  function avoid(n1:string, list: string[]) {
    list.map(person => attendees[n1].notAtTableWith(attendees[person]))
  }
  
  let bad = ['Roman', 'Shepherd', 'Borden', 'Cade']
  link('Kurt', 'Jane')
  link('Tasha', 'Edgar')
  link('Rich', 'Patterson')
  link('Keaton', 'Nas')
  avoid('Kurt', bad)
  avoid('Jane', bad)
  avoid('Tasha', bad)
  avoid('Edgar', bad)
  avoid('Patterson', bad)
  avoid('Nas', bad)
  
  return Object.values(attendees);
}