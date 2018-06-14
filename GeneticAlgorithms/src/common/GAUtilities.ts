import Genome from "./iGenome"

/**
 * Randomly chooses a genome from the pool based on its proportional fitness.
 * @return genome, randomly selected
 */
export async function roulette(pool: Genome[]): Promise<Genome> {
 let totalFitness = pool.reduce((acc, x) => acc + x.fitness, 0);
 let sum = 0;
 let threshold = totalFitness * Math.random();
 for(let i = 0; i < pool.length; i++) {
   sum += pool[i].fitness
   if(sum >= threshold) {
     return pool[i];
   }
 }
}

// Finds the fittest item from the given pool.
export async function fittest(pool: Genome[]): Promise<Genome> {
  let bestGenome: Genome = null;
  let bestScore: number = Number.MIN_SAFE_INTEGER;
  for(let i = 0; i < pool.length; i++) {
    let genome = pool[i];
    if(genome.fitness > bestScore) {
      bestGenome = genome;
      bestScore = genome.fitness;
    }
  }
  return bestGenome;
}

/**
 * Selects (1-P_CROSSOVER)*POOL_SIZE genomes to be carried on into the next generation without any crossover.
 * @return Array of genomes to be carried into next generation.
 */
export async function findSurvivors(pool: Genome[], cp: number): Promise<Genome[]> {
  let n = (1 - cp) * pool.length;
  return Promise.all(Array.from({length: n}, idx => roulette(pool)))
}

/**
 * Selects n parents from the given pool for crossover. 
 * @return Array of objects, holding two genomes each.
 */
export async function findParents(pool: Genome[], cp: number): Promise<Genome[][]> {
  let n = cp * pool.length;
  let parents: Promise<Genome[]>[] = [];
  for(let i = 0; i < n; i++) {
    parents.push(Promise.all([roulette(pool), roulette(pool)]))
  }
  return Promise.all(parents);
}

/**
* Performs single-point crossover on each of the parental pairs provided, returning a flat list of genomes to include in the next generation.
* @param parents List of objects containing two parents for crossing over.
* @return Array of genomes bred from parents.
*/
export async function crossover(parents: Genome[][]): Promise<Genome[]> {
 return parents.reduce((acc, pair) => {
   acc.push(...pair[0].cross(pair[1]))
   return acc
 }, [])
}

/**
 * Performs mutation over the given pool with the given probability.
 * In this version, mutation is attempted on each gene of each genome within the pool.
 * of a random genome to mutate.
 * @return Genome pool after mutation
 */
export async function mutate(pool: Genome[]): Promise<Genome[]> {
  return pool.map(g => g.mutate());
}