const { ranks, suites } = require('../utils');

const CardStat = (rank, suite, numRemaining) => {
  return {
    [rank]: {
      [suite]: { 
        numRemaining: numRemaining
      }
    }
  }
}

const Stats = numDecks => {
  let stats = []
  for (let rank of ranks) {
    for (let suite of suites) {
      let stat = CardStat(rank, suite, numDecks);
      stats.push(stat);
    }
  }
  return stats;
}

module.exports = Stats;