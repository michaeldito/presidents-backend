module.exports = async function(user) {
  // begin validations
  // 1 - user is required
  if (! user) {
    return Promise.reject(new Error('Missing argument, user is required.'));
  }

  // 2 - game has started
  if (0) {
    return Promise.reject(new Error('Cannot join game. It is already in progress.'));
  }

  // 3 - game is full, max players reached
  if (0) {
    return Promise.reject(new Error('Cannot join game. It is already full.'));
  }

  // 4 - user is already in the game
  if (0) {
    return Promise.reject(new Error('User has already joined game.'));
  }

  // add user to game
  this.players.push({
    user,
    seatPosition: this.players.length + 1
  });


  return this.save();
}
