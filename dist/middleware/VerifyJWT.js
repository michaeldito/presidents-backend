"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaJwt = _interopRequireDefault(require("koa-jwt"));

var _config = _interopRequireDefault(require("../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _config.default)();

var _default = (0, _koaJwt.default)({
  secret: process.env.JWT_SECRET,
  cookie: 'access_token',
  key: 'jwtdata',
  debug: true
});

exports.default = _default;