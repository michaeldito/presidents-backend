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
 *
 *
 */
function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (user) {
    (0, _logger.default)('[Presidents@drinkDrink()]'); // given that user has no drinks when they try to drink then bail out
    // given player does have drinks to drink when they try to drink
    // then drinksDrunk is incremented

    var player = this.players.find(player => player.user._id.toString() === user._id.toString());
    var {
      drinksReceived,
      drinksDrunk
    } = player;
    var hasDrinksToDrink = drinksReceived.length - drinksDrunk === 0;
    (0, _logger.default)("[Presidents@drinkDrink()] hasDrinksToDrink ".concat(hasDrinksToDrink));

    if (hasDrinksToDrink) {
      return Promise.reject(new Error('Unable to drink any drinks. User has none to drink.'));
    }

    player.drinksDrunk += 1;
    this.drinks.push({
      type: 'drink drunk',
      user: user.username
    });
    return this.save();
  });
  return _ref.apply(this, arguments);
}