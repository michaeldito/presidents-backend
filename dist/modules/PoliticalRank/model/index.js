"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PoliticalRankSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: [true, 'A name is required to create a political rank.'],
    unique: true
  },
  value: {
    type: Number,
    required: [true, 'A value is required to create a political rank.'],
    unique: true
  }
});

PoliticalRankSchema.statics.findByName = function (name) {
  return this.findOne({
    name
  });
};

PoliticalRankSchema.statics.findByValue = function (value) {
  return this.findOne({
    value
  });
};

PoliticalRankSchema.statics.getRanks = function (howMany) {
  return this.find({
    value: {
      $gt: 0,
      $lt: howMany + 1
    }
  });
};

PoliticalRankSchema.plugin(require('mongoose-unique-validator'));
PoliticalRankSchema.virtual('kind').get(function () {
  return 'PoliticalRank';
});
PoliticalRankSchema.virtual('displayId').get(function () {
  var {
    name,
    value
  } = this;
  return "".concat(name, " - ").concat(value);
});
PoliticalRankSchema.set('toObject', {
  virtuals: true
});
PoliticalRankSchema.set('toJSON', {
  virtuals: true
});

var PoliticalRank = _mongoose.default.model('PoliticalRank', PoliticalRankSchema);

var _default = PoliticalRank;
exports.default = _default;