"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var _model = _interopRequireDefault(require("../../../Card/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (turn) {
    (0, _logger.default)('[Presidents@shouldProcessTurn()]');
    (0, _logger.default)("[Presidents@shouldProcessTurn()] currentPlayer: ".concat(this.currentPlayer));
    (0, _logger.default)("[Presidents@shouldProcessTurn()] turnToBeat: ".concat(JSON.stringify(this.turnToBeat)));
    (0, _logger.default)("[Presidents@shouldProcessTurn()] turn: ".concat(JSON.stringify(turn))); // 1 - is it this players turn?

    var isPlayersTurn = this.currentPlayer.equals(turn.user);
    (0, _logger.default)("[Presidents@shouldProcessTurn()] isPlayersTurn: ".concat(isPlayersTurn));
    if (!isPlayersTurn) return Promise.reject(new Error("Unable to process turn. It is not your turn.")); // 2 - is the current hand valid (all ranks the same)?

    var areCardsValid = this.model('Presidents').areCardsValid(turn.cardsPlayed);
    (0, _logger.default)("[Presidents@shouldProcessTurn()] areCardsValid: ".concat(areCardsValid));
    if (!areCardsValid) return Promise.reject(new Error("Unable to process turn. The cards selected are invalid.")); // first turn of the game must contain 3 clubs

    if (this.rounds.length === 1 && this.rounds[0].turns.length === 0) {
      var contains3Clubs = turn.cardsPlayed.find(card => card.shortHand === '3Clubs');

      if (contains3Clubs) {
        (0, _logger.default)('[Presidents@shouldProcessTurn()] found 3 clubs on first hand of game');
        return Promise.resolve(true);
      }

      (0, _logger.default)('[Presidents@shouldProcessTurn()] first turn of game is not 3 clubs');
      return Promise.reject(new Error('First turn of the game must be a 3 of clubs'));
    } // first turn of every other round can be anything


    if (this.rounds[this.rounds.length - 1].length === 0) {
      (0, _logger.default)('[Presidents@shouldProcessTurn()] first turn of any round can be whatever');
      return Promise.resolve(true);
    } // it's a turn in the middle of the round, see if it's better than the lastx


    var areCardsBetter;

    try {
      if (this.turnToBeat === undefined || this.turnToBeat === null) {
        return Promise.resolve(true);
      }

      (0, _logger.default)("[Presidents@shouldProcessTurn()] cardsPlayed: ".concat(JSON.stringify(this.turnToBeat.cardsPlayed)));
      var cardsToBeat = yield _model.default.findManyByIds(this.turnToBeat.cardsPlayed);
      areCardsBetter = this.model('Presidents').areCardsBetter(cardsToBeat, turn.cardsPlayed);
      (0, _logger.default)("[Presidents@shouldProcessTurn()] areCardsBetter: ".concat(areCardsBetter));
    } catch (err) {
      return Promise.reject(new Error("Unable to process turn. The selected cards are not better. ".concat(err.message)));
    }

    (0, _logger.default)("[Presidents@shouldProcessTurn()] shouldProcessTurn: ".concat(areCardsBetter));

    if (areCardsBetter) {
      return Promise.resolve(true);
    }

    return Promise.reject(new Error('Unable to process turn. Not sure why.'));
  });
  return _ref.apply(this, arguments);
}