const PoliticalRank = require('../../PoliticalRank') ;
const GameStatus = require('../../GameStatus') ;


module.exports = async function(turn) {
  // assume turn.cardsPlayed have been validated
  // assume turn.cardsPlayed are better
  // assume we should process this turn
  // assume it meets the turn schema criteria
  
  console.log(`user | seat position`);
  console.log(this.players.map(player => `${player.user} ${player.seatPosition}`));
  
  // create turn in round for player
  this.rounds[this.rounds.length - 1].turns.push(turn);
  
  // TODO:
  // if a two was played then init next round

  // remove cards played from current players hand if they played any
  const didPlayerPlayCards = turn.cardsPlayed.length > 0;
  let currentPlayer;
  console.log(`didPlayerPlayCards: ${didPlayerPlayCards}`)
  if (turn.cardsPlayed.length > 0) {
    currentPlayer = this.players.find(player => player.user.toString() === turn.user.toString());
    console.log(`currentPlayer: ${currentPlayer}`)
    const currentPlayerCardIds = currentPlayer.hand.map(card => card._id);
    const turnCardIds = turn.cardsPlayed.map(card => card._id);
    currentPlayer.hand = currentPlayerCardIds.filter(card => ! turnCardIds.find(cardPlayed => cardPlayed.toString() === card.toString()));        
    console.log(`hand: ${currentPlayer.hand}`)
  }

  // if player has no more cards -> assign rank for next round
  const isPlayerOutOfCards = currentPlayer.hand.length === 0;
  console.log(`isPlayerOutOfCards: ${isPlayerOutOfCards}`)
  if (isPlayerOutOfCards) {
    const finishedPlayers = this.players.filter(player => player.nextGameRank);
    console.log(`finishedPlayers: ${finishedPlayers}`)
    const nextRoundRankValue = finishedPlayers.length + 1;
    console.log(`nextRoundRankValue: ${nextRoundRankValue}`);
    currentPlayer.nextGameRank = await PoliticalRank.findByValue(nextRoundRankValue);;
  }

  // if only 1 other player has cards -> finalized & set asshole
  const playersWithCards = this.players.filter(player => player.hand.length > 0);
  const isGameOver = playersWithCards.length === 1;
  console.log(`isGameOver: ${isGameOver}`)
  if (isGameOver) {
    this.status = await GameStatus.findOne({value: 'FINALIZED'});
    playersWithCards[0].nextGameRank = await PoliticalRank.findByName('Asshole');
  }

  // set next player
  const nextPlayer = await this.getNextPlayer();
  this.currentPlayer = nextPlayer.user;
  console.log(`nextPlayer: ${this.currentPlayer}`)

  // save before we might process skips
  await this.save();

  // process skips
  if (turn.skipsRemaining || turn.didCauseSkips) {
    const skipTurn = {
      user: this.currentPlayer,
      cardsPlayed: [],
      wasPassed: false,
      wasSkipped: true,
      didCauseSkips: false,
      skipsRemaining: turn.skipsRemaining - 1,
      endedRound: false
    }
    console.log(`recurse!\n`)
    return this.processTurn(skipTurn);
  }

  // TODO:
  // did current players last turn end the round?
  // mark it as a round ender

  return this.save();
}