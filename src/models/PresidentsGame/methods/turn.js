
PresidentsGameSchema.methods.processTurn = async function(turn) {
  // validations
  // turn = { player, cards: [card], pass: Boolean }

  // 1 - cards are different
  if (0)
    throw new Error(`Unable to process turn. The cards selected are invalid.`);

  // 2 - cannot take turn if not players turn
  if (0)
    throw new Error(`Unable to process turn. It is not player ${turn.player} turn. It is ${this.currentPlayer} turn.`);

  // 3 - turn.cards are not >= lastTurn.cards
  // find most recent turn added to current round in game
  if (0)
    throw new Error(`Unable to process turn. The cards selected do not beat the previous hand.`);


  if (turn.pass) {
    // create pass turn in round for player
    // return 
  }

  // calc skips

  // create turn in round for player

  // remove cards from players hand

  // process skips
    // while(skips):
    // get next player
    // create pass turn in round for player
    // skips--
  

  // set next player

  // if player has no more cards -> assign rank for next round

  // AND if only 1 other player has cards -> finalized & set asshole
  return this.model('PresidentsGame').findOne({name: this.name});
}
