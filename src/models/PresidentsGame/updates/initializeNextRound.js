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
  if (this.status.value === 'FINALIZED')
    return Promise.reject(new Error('Unable to start next round. The game is finalized.'));

  if (this.status.value === 'NOT_STARTED') {
    this.startedAt = new Date();
    this.status = await GameStatus.findOne({value: 'IN_PROGRESS'});
  }
  
  this.rounds.push({});

  return this.save();
}