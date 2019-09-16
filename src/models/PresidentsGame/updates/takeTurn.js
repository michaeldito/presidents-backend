const Utils = require('../../../utils');
/**
 * This method will add a turn to the current round, if it is valid.
 * 
 * # Validations
 * @throws {Error} Unable to process turn. The cards selected are invalid.
 * @throws {Error} Unable to process turn. It is not player ${turn.player} turn. It is ${this.currentPlayer} turn.
 * @throws {Error} Unable to process turn. The cards selected do not beat the previous hand.
 * @throws {Error} Unable to process turn. Not enough cards have been selected to beat the previous hand.
 * 
 * @param {Object} turn An object with properties defined in PresidentsTurnSchema.
 * @returns {Promise} Save result.
 * 
 */
module.exports = async function(turn) {
  // 1 - is it this players turn?
  const isPlayersTurn = turn.user === this.currentPlayer;
  if (! isPlayersTurn)
    return Promise.reject(new Error(`Unable to process turn. It is not player ${turn.user} turn. It is ${this.currentPlayer} turn.`));

  if (turn.wasPassed) {

    // process a pass

    // create turn in round for player
    const turnToAdd = {
      ...turn,
      wasSkipped: false,
      didCauseSkips: false,
      skipsRemaining: 0,
      endedRound: false
    };
    this.rounds[this.rounds.length - 1].turns.push(turnToAdd);

    // set next player
    this.currentPlayer = await this.getNextPlayer();

    return this.save();

  }

  // 2 - is the current hand valid (all ranks the same)?
  const currentHandCardRankValues = await this.model('Card').find({'cardRank.value': { $in: turn.cardsPlayed }});
  const rankValue = currentHandCardRankValues[0];
  const areCardsValid = currentHandCardRankValues.every(cardRankValue => cardRankValue === rankValue);
  if (! areCardsValid)
    return Promise.reject(new Error(`Unable to process turn. The cards selected are invalid.`));

  if (cardRankValue === 2) {

    // process a 2

    // create turn in round for player
    const turnToAdd = {
      ...turn,
      wasSkipped: false,
      didCauseSkips: false,
      skipsRemaining: 0,
      endedRound: true
    };
    this.rounds[this.rounds.length - 1].turns.push(turnToAdd);

    // remove cards played from current players hand
    let currentPlayer = this.players.find(player => player.user === turn.user);
    currentPlayer.hand = currentPlayer.hand.filter(card => ! turn.cardsPlayed.find(cardPlayed => cardPlayed === card));
   
    // set next player
    this.currentPlayer = await this.getNextPlayer();

    // if player has no more cards -> assign rank for next round
    if (currentPlayer.hand.length === 0) {
      const finishedPlayers = this.players.filter(player => player.nextGameRank);
      const nextRoundRankValue = finishedPlayers.length + 1;
      currentPlayer.nextGameRank = await this.model('PoliticalRank').findByValue(nextRoundRankValue);
    }

    // if only 1 other player has cards -> finalized & set asshole
    const playersWithCards = this.players.filter(player => player.hand.length > 0);
    if (playersWithCards.length === 1) {
      this.status = await this.model('GameStatus').findOne({value: 'FINALIZED'});
      playersWithCards[0].nextGameRank = await this.model('PoliticalRank').findByName('Asshole');
    }

    return this.save();

  }

  // 3 - is the current hand better?
  const handToBeatCardRankValues = await this.model('Card').find({'cardRank.value': { $in: this.handToBeat }});
  if (handToBeatCardRankValues.length < currentHandCardRankValues.length) {
    if (handToBeatCardRankValues[0] === currentHandCardRankValues[0]) {

      // process multiple skips

      // create turn in round for player
      const skipsRemaining = currentHandCardRankValues.length - handToBeatCardRankValues.length;
      const turnToAdd = {
        ...turn,
        wasSkipped: false,
        didCauseSkips: true,
        skipsRemaining,
        endedRound: false
      };
      this.rounds[this.rounds.length - 1].turns.push(turnToAdd);
      
      // remove cards from players hand
      let currentPlayer = this.players.find(player => player.user === turn.user);
      currentPlayer.hand = currentPlayer.hand.filter(card => ! turn.cardsPlayed.find(cardPlayed => cardPlayed === card));
        
      // set next player
      this.currentPlayer = await this.getNextPlayer();

      // if player has no more cards -> assign rank for next round
      if (currentPlayer.hand.length === 0) {
        const finishedPlayers = this.players.filter(player => player.nextGameRank);
        const nextRoundRankValue = finishedPlayers.length + 1;
        currentPlayer.nextGameRank = await this.model('PoliticalRank').findByValue(nextRoundRankValue);
      }

      // if only 1 other player has cards -> finalized & set asshole
      const playersWithCards = this.players.filter(player => player.hand.length > 0);
      if (playersWithCards.length === 1) {
        this.status = await this.model('GameStatus').findOne({value: 'FINALIZED'});
        playersWithCards[0].nextGameRank = await this.model('PoliticalRank').findByName('Asshole');

        return this.save();

      } else {

        // multiple skip processing

        let skipsToProcess = currentHandCardRankValues.length - handToBeatCardRankValues.length;
        while (skipsToProcess) {
          const skipTurn = {
            user: this.currentPlayer,
            wasPassed: false,
            wasSkipped: true,
            didCauseSkips: false,
            skipsRemaining: skipsToProcess - 1,
            endedRound: false
          }
          skipsToProcess--;
          this.rounds[this.rounds.length - 1].turns.push(skipTurn);
          this.currentPlayer = await this.getNextPlayer();
        }

        return this.save();

      }
    } else {

      // process turn

      // create turn in round for player
      const turnToAdd = {
        ...turn,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: true
      };
      this.rounds[this.rounds.length - 1].turns.push(turnToAdd);
  
      // remove cards played from current players hand
      let currentPlayer = this.players.find(player => player.user === turn.user);
      currentPlayer.hand = currentPlayer.hand.filter(card => ! turn.cardsPlayed.find(cardPlayed => cardPlayed === card));
      
      // set next player
      this.currentPlayer = await this.getNextPlayer();
  
      // if player has no more cards -> assign rank for next round
      if (currentPlayer.hand.length === 0) {
        const finishedPlayers = this.players.filter(player => player.nextGameRank);
        const nextRoundRankValue = finishedPlayers.length + 1;
        currentPlayer.nextGameRank = await this.model('PoliticalRank').findByValue(nextRoundRankValue);
      }
  
      // if only 1 other player has cards -> finalized & set asshole
      const playersWithCards = this.players.filter(player => player.hand.length > 0);
      if (playersWithCards.length === 1) {
        this.status = await this.model('GameStatus').findOne({value: 'FINALIZED'});
        playersWithCards[0].nextGameRank = await this.model('PoliticalRank').findByName('Asshole');
      }
  
      return this.save();

    }
  }
  if (handToBeatCardRankValues.length === currentHandCardRankValues.length) {
    if (handToBeatCardRankValues[0] === currentHandCardRankValues[0]) {

      // process single skip

      const turnToAdd = {
        ...turn,
        wasSkipped: false,
        didCauseSkips: true,
        skipsRemaining: 1,
        endedRound: false
      };
      this.rounds[this.rounds.length - 1].turns.push(turnToAdd);
      
      // remove cards from players hand
      let currentPlayer = this.players.find(player => player.user === turn.user);
      currentPlayer.hand = currentPlayer.hand.filter(card => ! turn.cardsPlayed.find(cardPlayed => cardPlayed === card));
        
      // set next player
      this.currentPlayer = await this.getNextPlayer();

      // if player has no more cards -> assign rank for next round
      if (currentPlayer.hand.length === 0) {
        const finishedPlayers = this.players.filter(player => player.nextGameRank);
        const nextRoundRankValue = finishedPlayers.length + 1;
        currentPlayer.nextGameRank = await this.model('PoliticalRank').findByValue(nextRoundRankValue);
      }

      // if only 1 other player has cards -> finalized & set asshole
      const playersWithCards = this.players.filter(player => player.hand.length > 0);
      if (playersWithCards.length === 1) {
        this.status = await this.model('GameStatus').findOne({value: 'FINALIZED'});
        playersWithCards[0].nextGameRank = await this.model('PoliticalRank').findByName('Asshole');

        return this.save();

      } else {

        // single skip processing

        const skipTurn = {
          user: this.currentPlayer,
          wasPassed: false,
          wasSkipped: true,
          didCauseSkips: false,
          skipsRemaining: 0,
          endedRound: false
        };
        this.rounds[this.rounds.length - 1].turns.push(skipTurn);
        this.currentPlayer = await this.getNextPlayer();

        return this.save();

      }
    } else if (currentHandCardRankValues[0] > handToBeatCardRankValues[0]) {

      // process turn

      // create turn in round for player
      const turnToAdd = {
        ...turn,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: true
      };
      this.rounds[this.rounds.length - 1].turns.push(turnToAdd);
  
      // remove cards played from current players hand
      let currentPlayer = this.players.find(player => player.user === turn.user);
      currentPlayer.hand = currentPlayer.hand.filter(card => ! turn.cardsPlayed.find(cardPlayed => cardPlayed === card));
      
      // set next player
      this.currentPlayer = await this.getNextPlayer();
  
      // if player has no more cards -> assign rank for next round
      if (currentPlayer.hand.length === 0) {
        const finishedPlayers = this.players.filter(player => player.nextGameRank);
        const nextRoundRankValue = finishedPlayers.length + 1;
        currentPlayer.nextGameRank = await this.model('PoliticalRank').findByValue(nextRoundRankValue);
      }
  
      // if only 1 other player has cards -> finalized & set asshole
      const playersWithCards = this.players.filter(player => player.hand.length > 0);
      if (playersWithCards.length === 1) {
        this.status = await this.model('GameStatus').findOne({value: 'FINALIZED'});
        playersWithCards[0].nextGameRank = await this.model('PoliticalRank').findByName('Asshole');
      }
  
      return this.save();

    } else { 
      // played same number of cards, but rank does not beat previous rank
      return Promise.reject(new Error(`Unable to process turn. The cards selected do not beat the previous hand.`));
    }
  }
  // handToBeatCardRankValues.length > currentHandCardRankValues.length)
  // AND currentHand does not contain 2
  return Promise.reject(new Error(`Unable to process turn. Not enough cards have been selected to beat the previous hand.`));
}
