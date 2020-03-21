"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _mongoose.default.Schema({
  doubleSkips: {
    type: Boolean,
    required: [true, 'A value for rules.doubleSkips is required to create a Presidents game.']
  },
  scumStarts: {
    type: Boolean,
    required: [true, 'A value for rules.scumStarts is required to create a Presidents game.']
  },
  scumHandsTwo: {
    type: Boolean,
    required: [true, 'A value for rules.scumHandsTwo is required to create a Presidents game.']
  },
  oneEyedJacksAndKingOfHearts: {
    type: Boolean,
    required: [true, 'A value for rules.oneEyedJacksAndKingOfHearts is required to create a Presidents game.']
  },
  reversePresidentScumTrade: {
    type: Boolean,
    required: [true, 'A value for rules.reversePresidentScumTrade is required to create a Presidents game.']
  },
  presidentDeals: {
    type: Boolean,
    required: [true, 'A value for rules.presidentDeals is required to create a Presidents game.']
  },
  goLow: {
    type: Boolean,
    required: [true, 'A value for rules.goLow is required to create a Presidents game.']
  },
  equalNumber: {
    type: Boolean,
    required: [true, 'A value for rules.equalNumber is required to create a Presidents game.']
  },
  noEndOnBomb: {
    type: Boolean,
    required: [true, 'A value for rules.noEndOnBomb is required to create a Presidents game.']
  },
  tripleSixes: {
    type: Boolean,
    required: [true, 'A value for rules.tripleSixes is required to create a Presidents game.']
  },
  passOut: {
    type: Boolean,
    required: [true, 'A value for rules.passOut is required to create a Presidents game.']
  },
  fourInARow: {
    type: Boolean,
    required: [true, 'A value for rules.fourInARow is required to create a Presidents game.']
  },
  larryPresidents: {
    type: Boolean,
    required: [true, 'A value for rules.larryPresidents is required to create a Presidents game.']
  }
});

exports.default = _default;