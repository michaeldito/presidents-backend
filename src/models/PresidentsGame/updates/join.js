/**
 * This method will add a user to a Presidents game.
 * It assigns a seatPosition to the player based on how many players
 * are in the game.
 * 
 * Validations
 * @throws {Error} Missing argument, user is required.
 * @throws {Error} Cannot join game. It`s in progress.
 * @throws {Error} Cannot join game. It`s finished.
 * @throws {Error} Cannot join game. It is already full.
 * @throws {Error} User has already joined game.
 * 
 * @param {Object} user Mongoose ObjectId of the user to add.
 * @returns {Promise} Save result.
 * 
 */
module.exports = async function(user) {
  if (! user) {
    return Promise.reject(new Error('Missing argument, user is required.'));
  }

  if (this.status.value === 'IN_PROGRESS') {
    return Promise.reject(new Error('Cannot join game. It\`s in progress.'));
  }
  
  if (this.status.value === 'FINALIZED') {
    return Promise.reject(new Error('Cannot join game. It\`s finished.'));
  }

  if (this.players.length === this.config.maxPlayers) {
    return Promise.reject(new Error('Cannot join game. It is already full.'));
  }

  const hasUserJoined = this.players.find(player => player.user.toString() === user.toString());
  if (hasUserJoined) {
    return Promise.reject(new Error('User has already joined game.'));
  }

  const seatPosition = this.players.length;
  this.players.push({ 
    user, 
    seatPosition,
    drinksDrunk: 0,
    drinksReceived: [],
    drinksSent: []
   });

  return this.save();
}