module.exports = async function(user) {
  // 1 - user is required
  if (! user) {
    return Promise.reject(new Error('Missing argument, user is required.'));
  }

  // 2 - game has started
  if (this.status.value !== 'IN_PROGRESS') {
    return Promise.reject(new Error('Cannot join game. It\`s in progress.'));
  }
  if (this.status.value !== 'FINALIZED') {
    return Promise.reject(new Error('Cannot join game. It\`s finished.'));
  }

  // 3 - game is full, max players reached
  if (this.players.length === this.config.maxPlayers) {
    return Promise.reject(new Error('Cannot join game. It is already full.'));
  }

  // 4 - user is already in the game
  if (this.players.find(player => player.user === user)) {
    return Promise.reject(new Error('User has already joined game.'));
  }

  // add user to game
  const seatPosition = this.players.length + 1;
  this.players.push({ user, seatPosition });

  return this.save();
}
