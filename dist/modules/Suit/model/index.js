"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SuitSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for every suit.'],
    unique: true
  },
  color: {
    type: String,
    required: [true, 'A color is required for every suit.']
  },
  character: {
    type: String,
    required: [true, 'A character is required for every suit.'],
    unique: true
  },
  value: {
    type: Number,
    required: [true, 'A value is required for every suit.'],
    unique: true
  }
});

SuitSchema.statics.findAll = function () {
  return this.find({});
};

SuitSchema.statics.findByName = function (name) {
  return this.findOne({
    name
  });
};

SuitSchema.plugin(_mongooseUniqueValidator.default);
SuitSchema.virtual('kind').get(function () {
  return 'Suit';
});
SuitSchema.virtual('displayId').get(function () {
  var {
    name,
    color,
    character
  } = this;
  return "".concat(name, " - ").concat(character, " - ").concat(color);
});
SuitSchema.set('toObject', {
  virtuals: true
});
SuitSchema.set('toJSON', {
  virtuals: true
});

var Suit = _mongoose.default.model('Suit', SuitSchema);

var _default = Suit;
exports.default = _default;