"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  discriminatorKey: 'kind',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};
var StatusSchema = new _mongoose.default.Schema({
  value: {
    type: String,
    required: [true, 'A Status must have a value to be created.'],
    trim: true,
    unique: [true, 'A Status must have a unique value to be created']
  }
}, options);

StatusSchema.statics.findByValue = function (value) {
  return this.findOne({
    value
  });
};

StatusSchema.virtual('displayId').get(function () {
  var {
    value,
    kind
  } = this;
  return "".concat(kind, " - ").concat(value);
});
StatusSchema.plugin(require('mongoose-unique-validator'));

var Status = _mongoose.default.model('Status', StatusSchema);

var _default = Status;
exports.default = _default;