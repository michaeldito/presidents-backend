"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _model = _interopRequireDefault(require("../../Status/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameStatusSchema = new _mongoose.default.Schema({});

var GameStatus = _model.default.discriminator('GameStatus', GameStatusSchema);

var _default = GameStatus;
exports.default = _default;