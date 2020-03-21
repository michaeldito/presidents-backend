"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var _model = _interopRequireDefault(require("../../../GameStatus/model"));

var _model2 = _interopRequireDefault(require("../../../PoliticalRank/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Preconditions:
 *  1. turn.cardsPlayed are valid and better than turnToBeat
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
function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (turn) {
    (0, _logger.default)('[Presidents@processTurn()]');
    (0, _logger.default)("[Presidents@processTurn()] turn: ".concat(JSON.stringify(turn, null, 2)));
    var userMap = this.players.map(player => {
      var p = {
        user: player.user,
        seatPosition: player.seatPosition,
        cards: [...player.hand.map(card => card.shortHand)]
      };
      return p;
    });
    (0, _logger.default)(userMap);
    (0, _logger.default)('[Presidents@processTurn()] turn.cardsPlayed');
    (0, _logger.default)(turn.cardsPlayed.map(card => card.shortHand)); // Add the turn to the current round

    var latestRound = this.rounds[this.rounds.length - 1];
    latestRound.turns.push(turn);
    (0, _logger.default)("[Presidents@processTurn()] skipTurn: ".concat(turn.wasSkipped)); // If turn.endedRound than initialize the next round.

    try {
      if (turn.endedRound) {
        (0, _logger.default)('[Presidents@processTurn()] Player played a round ending turn!');
        yield this.initializeNextRound();
      }
    } catch (err) {
      return Promise.reject(new Error("".concat(err.message)));
    } // If the turn has cardsPlayed then remove them from the player's hand


    var didPlayerPlayCards = turn.cardsPlayed.length > 0;
    (0, _logger.default)("[Presidents@processTurn()] didPlayerPlayCards: ".concat(didPlayerPlayCards));
    var currentPlayer = this.players.find(player => {
      var res = player.user._id.equals(turn.user);

      (0, _logger.default)("".concat(player.user._id.toString(), " === ").concat(turn.user, ": ").concat(res));
      return res;
    });
    (0, _logger.default)("[Presidents@processTurn()] currentPlayer: ".concat(currentPlayer));

    if (didPlayerPlayCards) {
      this.turnToBeat = latestRound.turns[latestRound.turns.length - 1];
      (0, _logger.default)("[Presidents@processturn()] this: ".concat(JSON.stringify(this, null, 2)));
      var cardsToKeep = currentPlayer.hand.filter(card => {
        var cardThatDidntGetPlayed = !turn.cardsPlayed.find(cardPlayed => cardPlayed._id.toString() === card._id.toString());
        return cardThatDidntGetPlayed;
      });
      currentPlayer.hand = cardsToKeep;
      (0, _logger.default)("[Presidents@processTurn()] cardsToKeep: ".concat(currentPlayer.hand.map(card => card.shortHand)));
    } // If the currentPlayer has no more cards then assign them a rank for the next game


    var isPlayerOutOfCards = currentPlayer.hand.length === 0;
    (0, _logger.default)("[Presidents@processTurn()] isPlayerOutOfCards: ".concat(isPlayerOutOfCards));

    if (isPlayerOutOfCards) {
      var finishedPlayers = this.players.filter(player => player.nextGameRank);
      (0, _logger.default)("[Presidents@processTurn()] finishedPlayers: ".concat(finishedPlayers));
      var nextGameRankValue = finishedPlayers.length + 1;
      (0, _logger.default)("[Presidents@processTurn()] nextGameRankValue: ".concat(nextGameRankValue));
      currentPlayer.nextGameRank = yield _model2.default.findByValue(nextGameRankValue);
    } // If only one other player has cards then finalize the game and set the rank for the last player


    var playersWithCards = this.players.filter(player => player.hand.length > 0);
    var isGameOver = playersWithCards.length === 1;
    (0, _logger.default)("[Presidents@processTurn()] isGameOver: ".concat(isGameOver));

    if (isGameOver) {
      this.status = yield _model.default.findOne({
        value: 'FINALIZED'
      });
      playersWithCards[0].nextGameRank = yield _model2.default.findByName('Asshole');
      return this.save();
    } // if they played a 2 and have more cards don't update current player


    if (turn.cardsPlayed.length > 0 && turn.cardsPlayed[0].cardRank.value === 2 && currentPlayer.hand.length > 0) {
      (0, _logger.default)("[Presidents@processTurn()] played a 2 and has more");
      this.turnToBeat.remove();
      return this.initializeNextRound();
    } // if they played a 2 and don't have more cards then update current player


    if (turn.cardsPlayed.length > 0 && turn.cardsPlayed[0].cardRank.value !== 2 && currentPlayer.hand.length === 0) {
      (0, _logger.default)("[Presidents@processTurn()] played a 2 and is now out!");
      this.currentPlayer = yield this.getNextPlayer();
      this.turnToBeat.remove();
      return this.initializeNextRound();
    }

    this.currentPlayer = yield this.getNextPlayer();
    return this.save();
  });
  return _ref.apply(this, arguments);
}