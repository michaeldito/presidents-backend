"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
function _default() {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* () {
    (0, _logger.default)('[Presidents@initialize()]');
    var {
      deal,
      find3Clubs,
      shuffle,
      sortCards
    } = this.model('Presidents');

    if (this.status.value === 'IN_PROGRESS') {
      (0, _logger.default)('[Presidents@initialize()] cannot initialize an in progress game');
      return Promise.reject(new Error('Unable to start game. It is already in progress.'));
    }

    if (this.status.value === 'FINALIZED') {
      (0, _logger.default)('[Presidents@initialize()] cannot initialize a finalized game');
      return Promise.reject(new Error('Unable to start game. It has already finished.'));
    }

    if (this.players.length < 2) {
      (0, _logger.default)('[Presidents@initialize()] cannot initialize a game with less than 2 players');
      return Promise.reject(new Error('Unable to start game. Minimum number of players is 2.'));
    }

    (0, _logger.default)('[Presidents@initialize()] shuffling, dealing, and assigning current player');
    var {
      deck
    } = this.config;
    var shuffledDeck = shuffle(deck);
    var numPlayers = this.players.length;
    var dealtCards = deal(numPlayers, shuffledDeck);
    this.players.forEach(player => player.hand = dealtCards[player.seatPosition]);
    var seatPositionWith3Clubs = find3Clubs(dealtCards);
    var playerWith3Clubs = this.players.find(player => player.seatPosition === seatPositionWith3Clubs);
    this.currentPlayer = playerWith3Clubs.user;
    this.drinks = [];
    return this.save();
  });
  return _ref.apply(this, arguments);
}