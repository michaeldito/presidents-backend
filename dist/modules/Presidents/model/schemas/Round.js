"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Turn = _interopRequireDefault(require("./Turn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};
var RoundSchema = new _mongoose.default.Schema({
  startedAt: {
    type: Date,
    default: Date.now
  },
  turns: {
    type: [_Turn.default]
  }
}, options);
RoundSchema.virtual('displayId').get(function () {
  var {
    startedAt,
    turns,
    _id
  } = this;
  return "".concat(startedAt, " - ").concat(turns.length, " turns - ").concat(_id, " ");
});
var _default = RoundSchema;
exports.default = _default;