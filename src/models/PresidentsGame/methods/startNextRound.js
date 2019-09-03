
PresidentsGameSchema.methods.startNextRound = async function() {
  // validations
  // cannot start next round if game has no rounds
  if (0)
    throw new Error('Unable to start next round. Start the first round first.');

  // cannot start next round if game is finalized
  if (0)
    throw new Error('Unable to start next round. The game is finalized.');

  // determine next round number

  // get deck, shuffle

  // get all rank assignments for last round

  // begin dealing at asshole.seatPosition + 1
  // wrap around when idx == players.length

  // current player = player with 3 clubs

  // get ranks

  // create round

  // save
  
  // return game
}