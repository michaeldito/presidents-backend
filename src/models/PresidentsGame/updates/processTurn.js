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
  console.log('[PresidentsGame@processTurn()]');
  console.log(`[PresidentsGame@processTurn()] turn: ${JSON.stringify(turn, null, 2)}`);

  let userMap = this.players.map(player => {
    let p = { 
      user: player.user,
      seatPosition: player.seatPosition,
      cards: [...player.hand.map(card => card.shortHand)]
    }
    return p;
  });
  console.table(userMap);
  
  console.log('[PresidentsGame@processTurn()] turn.cardsPlayed')
  console.log(turn.cardsPlayed.map(card => card.shortHand));

  // Add the turn to the current round
  let latestRound = this.rounds[this.rounds.length - 1];
  latestRound.turns = latestRound.turns.concat([turn]);
  console.log(`[PresidentsGame@processTurn()] skipTurn: ${turn.wasSkipped}`);

  // If turn.endedRound than initialize the next round.
  try {
    if (turn.endedRound) {
      console.log('[PresidentsGame@processTurn()] Player played a round ending turn!')
      await this.initializeNextRound();
    }
  } catch (err) {
    return Promise.reject(new Error(`${err.message}`));
  }

  // If the turn has cardsPlayed then remove them from the player's hand
  const didPlayerPlayCards = turn.cardsPlayed.length > 0;
  console.log(`[PresidentsGame@processTurn()] didPlayerPlayCards: ${didPlayerPlayCards}`)
  let currentPlayer = this.players.find(player => {
    let res = player.user._id.equals(turn.user);
    console.log(`${player.user._id.toString()} === ${turn.user}: ${res}`);
    return res;
  });
  console.log(`[PresidentsGame@processTurn()] currentPlayer: ${currentPlayer}`)

  if (didPlayerPlayCards) {
    this.handToBeat = turn.cardsPlayed;

    let cardsToKeep = currentPlayer.hand
      .filter(card => {
        let cardThatDidntGetPlayed = ! turn.cardsPlayed.find(cardPlayed => cardPlayed._id.toString() === card._id.toString());        
        return cardThatDidntGetPlayed;
      });
    
    currentPlayer.hand = cardsToKeep;
    console.log(`[PresidentsGame@processTurn()] cardsToKeep: ${currentPlayer.hand.map(card => card.shortHand)}`)
  }

  // If the currentPlayer has no more cards then assign them a rank for the next game
  const isPlayerOutOfCards = currentPlayer.hand.length === 0;
  console.log(`[PresidentsGame@processTurn()] isPlayerOutOfCards: ${isPlayerOutOfCards}`)
  if (isPlayerOutOfCards) {
    const finishedPlayers = this.players.filter(player => player.nextGameRank);
    console.log(`[PresidentsGame@processTurn()] finishedPlayers: ${finishedPlayers}`)
    const nextGameRankValue = finishedPlayers.length + 1;
    console.log(`[PresidentsGame@processTurn()] nextGameRankValue: ${nextGameRankValue}`);
    currentPlayer.nextGameRank = await PoliticalRank.findByValue(nextGameRankValue);
  }

  // If only one other player has cards then finalize the game and set the rank for the last player
  const playersWithCards = this.players.filter(player => player.hand.length > 0);
  const isGameOver = playersWithCards.length === 1;
  console.log(`[PresidentsGame@processTurn()] isGameOver: ${isGameOver}`)
  if (isGameOver) {
    this.status = await GameStatus.findOne({value: 'FINALIZED'});
    playersWithCards[0].nextGameRank = await PoliticalRank.findByName('Asshole');
    return this.save();
  }

  // if they played a 2 and have more cards don't update current player
  if (turn.cardsPlayed.length > 0 && turn.cardsPlayed[0].cardRank.value === 2 && currentPlayer.hand.length > 0) {
    console.log(`[PresidentsGame@processTurn()] played a 2 and has more`)
    this.handToBeat = [];
    return this.initializeNextRound();
  }

  // if they played a 2 and don't have more cards then update current player
  if (turn.cardsPlayed.length > 0 && turn.cardsPlayed[0].cardRank.value !== 2 && currentPlayer.hand.length === 0) {
    console.log(`[PresidentsGame@processTurn()] played a 2 and is now out!`)
    this.currentPlayer = await this.getNextPlayer();
    this.handToBeat = [];
    return this.initializeNextRound();
  }

  this.currentPlayer = await this.getNextPlayer();

  return this.save();
}