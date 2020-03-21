"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kcors = _interopRequireDefault(require("kcors"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var errorHandler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  });

  return function errorHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var middleware = [errorHandler, (0, _koaBodyparser.default)(), (0, _koaLogger.default)(), (0, _kcors.default)({
  credentials: true,
  exposeHeaders: ['Access-Token', 'Cookie']
})];
var Middleware = (0, _koaCompose.default)(middleware);
var _default = Middleware;
exports.default = _default;