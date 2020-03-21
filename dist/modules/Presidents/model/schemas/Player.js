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
var DrinkReceivedSchema = new _mongoose.default.Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  sentBy: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].drinksReceived.sentBy is required.']
  }
}, options);
DrinkReceivedSchema.virtual('displayId').get(function () {
  var {
    createdAt,
    sentBy
  } = this;
  return "".concat(createdAt, " - sentBy: ").concat(sentBy);
});
var DrinkSentSchema = new _mongoose.default.Schema({
  createdAt: {
    type: Date
  },
  sentTo: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].drinksSent.sentTo is required.']
  }
}, options);
DrinkSentSchema.virtual('displayId').get(function () {
  var {
    createdAt,
    sentTo
  } = this;
  return "".concat(createdAt, " - sentTo: ").concat(sentTo);
});
var PlayerSchema = new _mongoose.default.Schema({
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].user is required.'],
    autopopulate: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  seatPosition: {
    type: Number,
    required: [true, 'A value for players[i].seatPosition is required.']
  },
  hand: {
    type: [_mongoose.default.Schema.Types.ObjectId],
    ref: 'Card',
    autopopulate: true
  },
  politicalRank: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'PoliticalRank',
    autopopulate: true
  },
  nextGameRank: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'PoliticalRank',
    autopopulate: true
  },
  drinksDrunk: {
    type: Number,
    required: true
  },
  drinksReceived: {
    type: [DrinkReceivedSchema],
    required: true
  },
  drinksSent: {
    type: [DrinkSentSchema],
    required: true
  }
}, options);
PlayerSchema.virtual('displayId').get(function () {
  var {
    seatPosition,
    hand,
    user,
    politicalRank
  } = this;
  var name = user.username;
  politicalRank = politicalRank ? politicalRank.value : 'no rank';
  return "".concat(seatPosition, " - ").concat(name, " - ").concat(hand.length, " cards - ").concat(politicalRank, " ");
});
PlayerSchema.plugin(_mongooseAutopopulate.default);
var _default = PlayerSchema;
exports.default = _default;