"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModelSchema = new _mongoose.default.Schema({});
ModelSchema.virtual('kind').get(function () {
  return 'ModelKind';
});
ModelSchema.virtual('displayId').get(function () {
  return "Model - ".concat(this._id);
});
ModelSchema.set('toObject', {
  virtuals: true
});
ModelSchema.set('toJSON', {
  virtuals: true
});
ModelSchema.plugin(require('mongoose-autopopulate'));
ModelSchema.plugin(require('mongoose-unique-validator'));

var ModelKind = _mongoose.default.model('ModelKind', ModelSchema);

var _default = ModelKind;
exports.default = _default;