import GAString from "./GAString"
import Character from "./Character"
import GeneticAlgorithm from "../common/iGeneticAlgorithm"

const GOAL = "If you betray him, I will kill you";

// ============ Evolution loop.
function Evolution(){
  let GA: GeneticAlgorithm = new GAString(200, 0.95, 0.01, GOAL, 1);
  let pool = GA.initPool(getGenes());
  GA.evaluate(pool);
  while(!GA.isFinished()) {
    pool = GA.breed(pool);
    GA.evaluate(pool);
    console.log(`Gen: ${GA.generation} Fit: ${GA.fittest.fitness} Str: ${GA.fittest.toString()}`)
  }
};

Evolution();

function getGenes() {
  const genes = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ ,";
  return [...genes].map(c => new Character(c));
}