/**
 *  Goal: Find tables that maximize fitness
 *  Gene Space: Individuals.
 *  Genomes: A completed table
 *  Fitness:
 *  - Couples+ sit together (required, return unfit if not met)
 *  - Age gap is smallest (distance between uncoupled individuals, made negative for maximization)
 *  - Family is similar (# of individuals who are in same family)
 */


// const SPACE = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ ,"
// const randChar = () => SPACE[Math.floor(Math.random()*SPACE.length)]

// /**
//  * Creates a randomly generated pool of genomes to being evolving.
//  * @param {Int} poolSize Number of genomes to include in the pool
//  * @param {Int} goalSize Size of a single genome
//  * @return array of genomes
//  */
// function initPool(poolSize, goalSize) {
//   function randomGenome() {
//     return Array.from({length: goalSize}, x => randChar()).join('')
//   }
//   return Array.from({length: poolSize}, x => randomGenome())
// }

// /**
//  * Attaches a fitness score to each genome in the given pool, returned in a new copy of the pool - leaving the original unmodified.
//  * @param {Array} pool List of genomes in the generation
//  * @param {String} goal Goal string to achieve
//  * @return Array of objects representing genome (g) and its fitness (score)
//  */
// function fitness(pool, goal) {
//   function fitness(genome) {
//     return genome.split('')
//            .reduce((acc, x, i) => {
//               let match = (x === goal[i] ? 1 : 0)
//               return (acc + match)
//            }, 0)
//   }
//   return pool.map(x =>{ return {g: x, score: fitness(x)} })
// }

// /**
//  * Obtains the fittest individual from the given pool.
//  * @param {Array} evald_pool Objects representing genome (g) and its fitness (score)
//  * @return Object with genome string (g) and fitness score (score)
//  */
// function fittest(evald_pool) {
//   return evald_pool.reduce((acc, x) => {
//     if(x.score > acc.score) {
//       acc.score = x.score
//       acc.g = x.g
//     }
//     return acc
//   }, {g: "", score: 0})
// }

// /**
//  * Randomly chooses a genome from the pool based on its proportional fitness.
//  * @param {Int} totalFitness Sum of fitness in pool.
//  * @param {Array} evald_pool Objects representing genome (g) and its fitness (score)
//  * @return genome string, randomly selected.
//  */
// function roulette(totalFitness, evald_pool) {
//   let sum = 0;
//   let threshold = totalFitness * Math.random();
//   for(let i = 0; i < evald_pool.length; i++) {
//     sum += evald_pool[i].score
//     if(sum >= threshold) {
//       return evald_pool[i].g;
//     }
//   }
// }

// /**
//  * Selects (1-P_CROSSOVER)*POOL_SIZE genomes to be carried on into the next generation without any crossover.
//  * @param {Array} evald_pool Objects representing genome (g) and its fitness (score)
//  * @return Array of genome strings to be carried into next generation.
//  */
// function selectSurvivors(evald_pool, n) {
//   let totalFitness = evald_pool.reduce((acc, x) => acc + x.score, 0)
//   return Array.from({length: n}, x => roulette(totalFitness, evald_pool))
// }

// /**
//  * Selects n parents from the given pool for crossover. 
//  * @param {Array} evald_pool Objects representing genome (g) and its fitness (score)
//  * @return Array of objects, holding two genomes each.
//  */
// function selectParents(evald_pool, n) {
//   let totalFitness = evald_pool.reduce((acc, x) => acc + x.score, 0)
//   return Array.from({length: n}, x => [ 
//     roulette(totalFitness, evald_pool), 
//     roulette(totalFitness, evald_pool)
//   ])
// }

// /**
//  * Performs single-point crossover on each of the parental pairs provided, returning a flat list of genomes to include in the next generation.
//  * @param {Array} parents List of objects containing two parents for crossing over.
//  * @return Array of genomes bred from parents.
//  */
// function crossover(parents) {
//   function cross(pair) {
//     let [p1, p2] = pair;
//     let point = Math.random()*p1.length
//     let c1 = p1.substring(0, point) + p2.substring(point);
//     let c2 = p2.substring(0, point) + p1.substring(point);
//     return [c1, c2]
//   }
//   return parents.reduce((acc, pair) => {
//     acc.push(...cross(pair))
//     return acc
//   }, [])
// }

// /**
//  * Performs mutation over the given pool with the given probability, without mutating values that already meet the goal.
//  * In this version, mutation is attempted on each gene of each genome within the pool rather than picking a singular gene 
//  * of a random genome to mutate.
//  * @param {Array} pool List of genome strings
//  * @param {float} prob probability of mutation
//  * @param {String} goal Goal string to achieve
//  * @return Genome pool after mutation
//  */
// function mutate(pool, prob, goal) {
//   return pool.map(g => {
// 	for(let i = 0; i < g.length; i++) {
// 		if(g[i] != goal[i] && Math.random() <= prob) {
// 		  g = g.substr(0, i) + randChar() + g.substr(i+1);
// 		}
// 	}
// 	return g
//   })
// }


// const evolution = (GOAL, POOL_SIZE, P_CROSSOVER, P_MUTATION, THRESHOLD) => {
//   let generation = 0
//   let pool = initPool(POOL_SIZE, GOAL.length)
//   let evald_pool = fitness(pool, GOAL)
//   let best = fittest(evald_pool)
//   while(best.score/GOAL.length < THRESHOLD) {
//     generation += 1
//     let survivors = selectSurvivors(evald_pool, (1 - P_CROSSOVER) * POOL_SIZE)
//     let parents = selectParents(evald_pool, P_CROSSOVER * POOL_SIZE)
//     let children = crossover(parents)
//     pool = [...survivors, ...children]
//     pool = mutate(pool, P_MUTATION, GOAL)
//     evald_pool = fitness(pool, GOAL)
//     best = fittest(evald_pool)
//     console.log(`Gen: ${generation} Fit: ${best.score} Str: ${best.g}`)
//   }
//   return best
// }

// evolution("If you betray him, I will kill you", 200, 0.95, 0.01, 1)
