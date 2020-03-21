"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var _utils = _interopRequireDefault(require("../../../../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Preconditions: The userIds for fromUser and toUser are associated with players in the game.
 *
 * Algorithm:
 *  1. Get the two players in the game.
 *  2. If either of them doesn't have the politicalRank property, it's the first round and no one has a rank
 *     so don't allow a drink to be given.
 *  3. Otherwise check if the drink giver has a better rank than the drink receiver.
 *  4. If they do, check if the receiver has a drink to drink from the giver.
 *  5. If they have a drink to drink then reject, because you can't stack drinks.
 *  6. If they don't update fromPlayer.drinksSent and toPlayer.drinksReceived.
 *  7. Save and return.
 */
function _default(_x, _x2) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (fromUser, toUser) {
    (0, _logger.default)('[Presidents@giveDrink()]');
    var fromPlayer = this.players.find(player => player.user._id.equals(fromUser._id));
    var toPlayer = this.players.find(player => player.user._id.equals(toUser._id));

    if (!fromPlayer.toObject().hasOwnProperty('politicalRank') || !toPlayer.toObject().hasOwnProperty('politicalRank')) {
      return Promise.reject(new Error('you must wait til all players have ranks to give drinks out'));
    } // President is #1, Vice President #2, etc. so rank is actually reversed


    var doesGiverOutRankReceiver = fromPlayer.politicalRank.value < toPlayer.politicalRank.value;
    (0, _logger.default)("[Presidents@giveDrink()] doesGiverOutRankReceiver ".concat(doesGiverOutRankReceiver));

    if (!doesGiverOutRankReceiver) {
      return Promise.reject(new Error('fromPlayer must out rank toPlayer in order to give a drink'));
    }

    var {
      drinksDrunk
    } = toPlayer;
    var doesReceiverHaveDrinksToDrink = toPlayer.drinksReceived.length - drinksDrunk;
    (0, _logger.default)("[Presidents@giveDrink()] doesReceiverHaveDrinksToDrink ".concat(doesReceiverHaveDrinksToDrink));

    if (doesReceiverHaveDrinksToDrink) {
      var drinksToDrink = toPlayer.drinksReceived.slice(drinksDrunk);
      (0, _logger.default)(drinksToDrink);
      (0, _logger.default)(fromUser);
      var doesReceiverAlreadyHaveADrinkFromGiver = drinksToDrink.find(drink => drink.sentBy.toString() === fromUser._id.toString());
      (0, _logger.default)("[Presidents@giveDrink()] doesReceiverAlreadyHaveADrinkFromGiver ".concat(doesReceiverAlreadyHaveADrinkFromGiver));

      if (doesReceiverAlreadyHaveADrinkFromGiver) {
        return Promise.reject(new Error("toPlayer already has a drink to drink from fromPlayer. you can't give another"));
      }
    }

    fromPlayer.drinksSent.push({
      sentTo: toUser
    });
    toPlayer.drinksReceived.push({
      sentBy: fromUser
    });
    this.drinks.push({
      type: 'drink given',
      from: fromUser.username,
      to: toUser.username
    });
    return this.save();
  });
  return _ref.apply(this, arguments);
}