"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardRankSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for every card rank.'],
    unique: true
  },
  character: {
    type: String,
    required: [true, 'A character is required for every card rank.'],
    unique: true
  },
  value: {
    type: Number,
    required: [true, 'A value is required for every card rank.'],
    unique: true
  }
});

CardRankSchema.statics.getAll = function () {
  return this.find({});
};

CardRankSchema.statics.findByChar = function (character) {
  return this.findOne({
    character
  });
};

CardRankSchema.virtual('kind').get(function () {
  return 'CardRank';
});
CardRankSchema.virtual('displayId').get(function () {
  var {
    name
  } = this;
  var {
    character
  } = this;
  var {
    value
  } = this;
  return "".concat(name, " - ").concat(character, " - ").concat(value);
});
CardRankSchema.set('toObject', {
  virtuals: true
});
CardRankSchema.set('toJSON', {
  virtuals: true
});
CardRankSchema.plugin(require('mongoose-unique-validator'));

var CardRank = _mongoose.default.model('CardRank', CardRankSchema);

var _default = CardRank;
exports.default = _default;