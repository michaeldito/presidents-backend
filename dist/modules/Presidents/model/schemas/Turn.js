"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseAutopopulate = _interopRequireDefault(require("mongoose-autopopulate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};
var TurnSchema = new _mongoose.default.Schema({
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for rounds[i].turns[i].user is required.']
  },
  takenAt: {
    type: Date,
    default: Date.now
  },
  cardsPlayed: {
    type: [_mongoose.default.Schema.Types.ObjectId],
    ref: 'Card',
    autopopulate: true
  },
  wasPassed: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].wasPassed is required.']
  },
  wasSkipped: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].wasSkipped is required.']
  },
  didCauseSkips: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].didCauseSkips is required.']
  },
  skipsRemaining: {
    type: Number,
    required: [true, 'A value for rounds[i].turns[i].skipsRemaining is required.']
  },
  endedRound: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].endedRound is required.']
  }
}, options);
TurnSchema.virtual('displayId').get(function () {
  var {
    user,
    wasPassed,
    wasSkipped,
    cardsPlayed
  } = this;
  return "".concat(user, " - passed? ").concat(wasPassed, " - skipped? ").concat(wasSkipped, " - ").concat(cardsPlayed.length, " cards ");
});
TurnSchema.plugin(_mongooseAutopopulate.default);
var _default = TurnSchema;
exports.default = _default;