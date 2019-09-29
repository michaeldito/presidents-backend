const PoliticalRank = require('../../PoliticalRank') ;
const GameStatus = require('../../GameStatus') ;

/**
 * Preconditions:
 *  1. turn.cardsPlayed are valid and better than handToBeat
 *  2. shouldProcessTurn has returned true
 *  3. turn meets it's schemas criteria
 * 
 * Algorithm:
 *  1. Add the turn to the current round.
 *  2. If turn.endedRound than initialize the next round.
 *  2. If the turn has cardsPlayed then remove them from the player's hand.
 *  3. If the currentPlayer has no more cards then assign them a rank for the next game.
 *  4. If only one other player has cards:
 *  4a. -> Finalize the game
 *  4b. -> Set the rank for the last player
 *  4c. -> Save and return.
 *  5. If more than one player remains then set the next player.
 *  6. Save the game before potentially processing skip turns.
 *  7. If we have skip turns to process, process them recursively.
 *  8. After skips may/may not have been processed, check if the next player we just set to current played a turn
 *     so good that it ended the round. If so mark it as a round ender.
 */
module.exports = async function(turn) {
  // console.log(`user | seat position`);
  // console.log(this.players.map(player => `${player.user} ${player.seatPosition}`));
  
  // Add the turn to the current round
  this.rounds[this.rounds.length - 1].turns.push(turn);

  // If turn.endedRound than initialize the next round.
  try {
    if (turn.endedRound) {
      // console.log('Player played a round ending turn!')
      await this.initializeNextRound();
    }
  } catch (err) {
    return Promise.reject(new Error(`${err.message}`));
  }

  // If the turn has cardsPlayed then remove them from the player's hand
  const didPlayerPlayCards = turn.cardsPlayed.length > 0;
  // console.log(`didPlayerPlayCards: ${didPlayerPlayCards}`)
  let currentPlayer = this.players.find(player => player.user.toString() === turn.user.toString());
  if (didPlayerPlayCards) {
    // console.log(`currentPlayer: ${currentPlayer}`)
    const currentPlayerCardIds = currentPlayer.hand.map(card => card._id);
    const turnCardIds = turn.cardsPlayed.map(card => card._id);
    currentPlayer.hand = currentPlayerCardIds.filter(card => ! turnCardIds.find(cardPlayed => cardPlayed.toString() === card.toString()));        
    // console.log(`hand: ${currentPlayer.hand}`)
  }

  // If the currentPlayer has no more cards then assign them a rank for the next game
  const isPlayerOutOfCards = currentPlayer.hand.length === 0;
  // console.log(`isPlayerOutOfCards: ${isPlayerOutOfCards}`)
  if (isPlayerOutOfCards) {
    const finishedPlayers = this.players.filter(player => player.nextGameRank);
    // console.log(`finishedPlayers: ${finishedPlayers}`)
    const nextGameRankValue = finishedPlayers.length + 1;
    // console.log(`nextGameRankValue: ${nextGameRankValue}`);
    currentPlayer.nextGameRank = await PoliticalRank.findByValue(nextGameRankValue);
  }

  // If only one other player has cards then finalize the game and set the rank for the last player
  const playersWithCards = this.players.filter(player => player.hand.length > 0);
  const isGameOver = playersWithCards.length === 1;
  // console.log(`isGameOver: ${isGameOver}`)
  if (isGameOver) {
    this.status = await GameStatus.findOne({value: 'FINALIZED'});
    playersWithCards[0].nextGameRank = await PoliticalRank.findByName('Asshole');
    return this.save();
  }

  // If more than one player remains then set the next player
  const nextPlayer = await this.getNextPlayer();
  // console.log(`nextPlayer: ${nextPlayer}`)
  this.currentPlayer = nextPlayer.user;

  /** 
  
  TODO: 
  - Process skips in the controller to make for a cleaner method 
   
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
   
  TODO:
  - did the next players' last turn end the round?
  - mark it as a round ender
 
  */

  // Save the game
  return this.save();
}