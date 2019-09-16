const { 
  PoliticalRank,
  GameStatus
} = require('../../');

module.exports = async function(turn) {
  // create turn in round for player
  this.rounds[this.rounds.length - 1].turns.push(turn);

  // remove cards played from current players hand if they played any
  if (turn.cardsPlayed.length > 0) {
    let currentPlayer = this.players.find(player => player.user === turn.user);
    currentPlayer.hand = currentPlayer.hand.filter(card => ! turn.cardsPlayed.find(cardPlayed => cardPlayed === card));        
  }

  // set next player
  this.currentPlayer = await this.getNextPlayer();

  // if player has no more cards -> assign rank for next round
  if (currentPlayer.hand.length === 0) {
    const finishedPlayers = this.players.filter(player => player.nextGameRank);
    const nextRoundRankValue = finishedPlayers.length + 1;
    currentPlayer.nextGameRank = await PoliticalRank.findByValue(nextRoundRankValue);
  }

  // if only 1 other player has cards -> finalized & set asshole
  const playersWithCards = this.players.filter(player => player.hand.length > 0);
  if (playersWithCards.length === 1) {
    this.status = await GameStatus.findOne({value: 'FINALIZED'});
    playersWithCards[0].nextGameRank = await PoliticalRank.findByName('Asshole');
  }

  return this.save();
}