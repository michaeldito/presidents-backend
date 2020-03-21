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
 * This method will add a user to a Presidents game.
 * It assigns a seatPosition to the player based on how many players
 * are in the game.
 *
 * Validations
 * @throws {Error} Missing argument, user is required.
 * @throws {Error} Cannot join game. It`s in progress.
 * @throws {Error} Cannot join game. It`s finished.
 * @throws {Error} Cannot join game. It is already full.
 * @throws {Error} User has already joined game.
 *
 * @param {Object} user Mongoose ObjectId of the user to add.
 * @returns {Promise} Save result.
 *
 */
function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (user) {
    (0, _logger.default)('[Presidents@join()]');
    (0, _logger.default)("[Presidents@join()] user: ".concat(user));

    if (!user) {
      (0, _logger.default)("[Presidents@join()] missing arg user is required");
      return Promise.reject(new Error('Missing argument, user is required.'));
    }

    if (this.status.value === 'IN_PROGRESS') {
      (0, _logger.default)("[Presidents@join()] cannot join game in progress");
      return Promise.reject(new Error('Cannot join game. It`s in progress.'));
    }

    if (this.status.value === 'FINALIZED') {
      (0, _logger.default)("[Presidents@join()] cannot join a finalized game");
      return Promise.reject(new Error('Cannot join game. It`s finished.'));
    }

    if (this.players.length === this.config.maxPlayers) {
      (0, _logger.default)("[Presidents@join()] cannot join a full game");
      return Promise.reject(new Error('Cannot join game. It is already full.'));
    }

    var hasUserJoined = this.players.find(player => player.user._id.equals(user._id));

    if (hasUserJoined) {
      (0, _logger.default)("[Presidents@join()] user already joined");
      return Promise.reject(new Error('User has already joined game.'));
    }

    var seatPosition = this.players.length;
    var player = {
      user: user._id,
      seatPosition,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };

    if (user.nextGameRank) {
      player.politicalRank = user.nextGameRank;
    }

    (0, _logger.default)("[Presidents@join()] adding player ".concat(player));
    this.players.push(player);
    return this.save();
  });
  return _ref.apply(this, arguments);
}