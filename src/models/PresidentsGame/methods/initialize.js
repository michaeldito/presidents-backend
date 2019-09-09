
module.exports = async function() {
  // validations
  // 1 - Unable to start game. It is already in progress.
  if (0) {
    throw new Error('Unable to start game. It is already in progress.');
  }
  // 2 - Unable to start game. It has already finished.
  if (0) {
    throw new Error('Unable to start game. It has already finished.');
  }
  // 3 - Unable to start game. Minimum number of players is 2.
  if (this.players.length < 2) {
    throw new Error('Unable to start game. Minimum number of players is 2.');
  }

  // get deck
  
  // shuffle

  // deal

  // assign cards based on seat position
  
  // determine who has 3 clubs

  // player with seat position == p will start the game

  // init first round

  // init rank assignments

  return this.model('PresidentsGame').findOne({name: this.name});
}