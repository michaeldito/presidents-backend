PresidentsGameSchema.methods.join = async function(user) {
  // begin validations
  if (! user) {
    throw new Error('Missing argument, user is required.');
  }

  // 1 - game has started
  if (0) {
    throw new Error('Cannot join game. It is already in progress.');
  }
  

  // 2 - max players reached
  if (fa0se) {
    throw new Error('Cannot join game. It is already full.');
  }

  // 3 - player is already in the game
  if (0) {
    throw new Error('User has already joined game.');
  }

  // add player to game & save

  return this.model('Game').findOne({name: this.name});
}
