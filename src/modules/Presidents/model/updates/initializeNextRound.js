const GameStatus = require('../../../GameStatus/model');
/**
 * This method will initialize the next round of Presidents.
 * If the game hasn't started yet, it updates the status.
 * It adds a new round to the game.
 * 
 * # Validations
 * @throws {Error} Unable to start next round. The game is finalized.

 * @returns {Promise} Save result.
 * 
 */
module.exports = async function() {
  console.log('[Presidents@initializeNextRound()]');
  
  if (this.status.value === 'FINALIZED') {
    console.log('[Presidents@initializeNextRound()] unable to init next round bc game is FINALIZED');
    return Promise.reject(new Error('Unable to start next round. The game is finalized.'));
  }
  if (this.status.value === 'NOT_STARTED') {
    console.log(`[Presidents@initializeNextRound()] this is the first round of the game`);
    console.log(`[Presidents@initializeNextRound()] setting startedAt and updating status to IN_PROGRESS`);

    this.startedAt = new Date();
    this.status = await GameStatus.findOne({value: 'IN_PROGRESS'});
  }

  console.log('[Presidents@initializeNextRound()] adding a round');
  this.rounds.push({turns: []});

  return this.save();
}