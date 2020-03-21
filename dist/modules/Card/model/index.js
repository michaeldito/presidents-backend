"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseAutopopulate = _interopRequireDefault(require("mongoose-autopopulate"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardSchema = new _mongoose.default.Schema({
  shortHand: {
    type: String,
    required: [true, 'A shorthand is required for every card.'],
    unique: true
  },
  cardRank: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'CardRank',
    required: [true, 'A card rank is required for every card.'],
    autopopulate: true
  },
  suit: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Suit',
    required: [true, 'A suit is required for every card.'],
    autopopulate: true
  }
});

CardSchema.statics.getDeck = function () {
  return this.find({});
};

CardSchema.statics.findManyByIds = function (ids) {
  return this.find({
    _id: {
      $in: ids
    }
  });
};

CardSchema.virtual('kind').get(function () {
  return 'Card';
});
CardSchema.virtual('displayId').get(function () {
  var rankName = this.cardRank.name;
  var suitName = this.suit.name;
  var {
    character
  } = this.suit;
  var {
    color
  } = this.suit;
  return "".concat(rankName, " - ").concat(suitName, " - ").concat(character, " - ").concat(color);
});
CardSchema.set('toObject', {
  virtuals: true
});
CardSchema.set('toJSON', {
  virtuals: true
});
CardSchema.plugin(_mongooseAutopopulate.default);
CardSchema.plugin(_mongooseUniqueValidator.default);

var Card = _mongoose.default.model('Card', CardSchema);

var _default = Card;
exports.default = _default;