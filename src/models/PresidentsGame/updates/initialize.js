const Utils = require('../../../utils');

/**
 * This method will initialize a Presidents game.
 * It assigns cards to each player based on seat position.
 * It marks the player with the 3 Clubs as the current player.
 * 
 * Validations
 * @throws {Error} Unable to start game. It is already in progress.
 * @throws {Error} Unable to start game. It has already finished.
 * @throws {Error} Unable to start game. Minimum number of players is 2.

 * @returns {Promise} Save result.
 * 
 */
module.exports = async function() {
  console.log('[PresidentsGame@initialize()]');
  
  if (this.status.value === 'IN_PROGRESS') {
    console.log('[PresidentsGame@initialize()] cannot initialize an in progress game');
    return Promise.reject(new Error('Unable to start game. It is already in progress.'));
  }

  if (this.status.value === 'FINALIZED') {
    console.log('[PresidentsGame@initialize()] cannot initialize a finalized game');
    return Promise.reject(new Error('Unable to start game. It has already finished.'));
  }

  if (this.players.length < 2) {
    console.log('[PresidentsGame@initialize()] cannot initialize a game with less than 2 players');
    return Promise.reject(new Error('Unable to start game. Minimum number of players is 2.'));
  }

  console.log('[PresidentsGame@initialize()] shuffling, dealing, and assigning current player');

  let { deck } = this.config;
  let shuffledDeck = Utils.shuffle(deck);
  const numPlayers = this.players.length;
  let dealtCards = Utils.deal(numPlayers, shuffledDeck);
  this.players.forEach(player => player.hand = Utils.sortCards(dealtCards[player.seatPosition]));
  const seatPositionWith3Clubs = Utils.find3Clubs(dealtCards);
  const playerWith3Clubs = this.players.find(player => player.seatPosition === seatPositionWith3Clubs);
  this.currentPlayer = playerWith3Clubs.user;

  return this.save();
}