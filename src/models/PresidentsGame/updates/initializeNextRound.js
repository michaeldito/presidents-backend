const GameStatus = require('../../GameStatus')
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
  console.log('[PresidentsGame@initializeNextRound()]');
  
  if (this.status.value === 'FINALIZED') {
    console.log('[PresidentsGame@initializeNextRound()] unable to init next round bc game is FINALIZED');
    return Promise.reject(new Error('Unable to start next round. The game is finalized.'));
  }
  if (this.status.value === 'NOT_STARTED') {
    console.log(`[PresidentsGame@initializeNextRound()] this is the first round of the game`);
    console.log(`[PresidentsGame@initializeNextRound()] setting startedAt and updating status to IN_PROGRESS`);

    this.startedAt = new Date();
    this.status = await GameStatus.findOne({value: 'IN_PROGRESS'});
  }

  console.log('[PresidentsGame@initializeNextRound()] adding a round');
  this.rounds = this.rounds.concat([{}]);

  return this.save();
}