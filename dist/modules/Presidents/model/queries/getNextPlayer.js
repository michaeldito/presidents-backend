"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default() {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* () {
    (0, _logger.default)('[Presidents@getNextPlayer()]');
    (0, _logger.default)(this);
    var currentPlayer = this.players.find(player => player.user._id.equals(this.currentPlayer));
    var currentSeatPosition = currentPlayer.seatPosition;
    (0, _logger.default)("[Presidents@getNextPlayer()] current seat position: ".concat(currentSeatPosition));
    var nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
    (0, _logger.default)("[Presidents@getNextPlayer()] nextSeatPosition: ".concat(nextSeatPosition));
    var searching = true;
    var nextPlayer;
    (0, _logger.default)('[Presidents@getNextPlayer()] begininng to search for next player');

    while (searching) {
      nextPlayer = this.players.find(player => player.seatPosition === nextSeatPosition);

      if (nextPlayer.toObject().hasOwnProperty('nextGameRank')) {
        (0, _logger.default)("[Presidents@getNextPlayer()] player ".concat(nextPlayer.user, " - ").concat(nextPlayer.seatPosition, " is not next bc they are out"));
        nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
        (0, _logger.default)("[Presidents@getNextPlayer()] nextSeatPosition ".concat(nextSeatPosition));
      } else {
        (0, _logger.default)("[Presidents@getNextPlayer()] user ".concat(nextPlayer.user, " is next"));
        searching = false;
      }
    }

    return nextPlayer.user._id;
  });
  return _ref.apply(this, arguments);
}