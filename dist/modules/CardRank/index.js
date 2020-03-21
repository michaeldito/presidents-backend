"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = _interopRequireDefault(require("./model"));

var _service = _interopRequireDefault(require("./service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Module = {
  Model: _model.default,
  Service: _service.default
};
var _default = Module;
exports.default = _default;