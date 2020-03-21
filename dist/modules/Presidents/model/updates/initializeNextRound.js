"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var _model = _interopRequireDefault(require("../../../GameStatus/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * This method will initialize the next round of Presidents.
 * If the game hasn't started yet, it updates the status.
 * It adds a new round to the game.
 * 
 * # Validations
 * @throws {Error} Unable to start next round. The game is finalized.

 * @returns {Promise} Save result.
 * 
 */
function _default() {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* () {
    (0, _logger.default)('[Presidents@initializeNextRound()]');

    if (this.status.value === 'FINALIZED') {
      (0, _logger.default)('[Presidents@initializeNextRound()] unable to init next round bc game is FINALIZED');
      return Promise.reject(new Error('Unable to start next round. The game is finalized.'));
    }

    if (this.status.value === 'IN_PROGRESS') {
      (0, _logger.default)('[Presidents@initializeNextRound()] game in progress - adding a round');
      this.rounds.push({
        turns: []
      });

      if (this.turnToBeat) {
        this.turnToBeat.remove();
      }
    }

    if (this.status.value === 'NOT_STARTED') {
      (0, _logger.default)("[Presidents@initializeNextRound()] this is the first round of the game");
      (0, _logger.default)("[Presidents@initializeNextRound()] setting startedAt and updating status to IN_PROGRESS");
      this.startedAt = new Date();
      this.status = yield _model.default.findOne({
        value: 'IN_PROGRESS'
      });
      (0, _logger.default)('[Presidents@initializeNextRound()] adding a round');
      this.rounds.push({
        turns: []
      });
    }

    return this.save();
  });
  return _ref.apply(this, arguments);
}