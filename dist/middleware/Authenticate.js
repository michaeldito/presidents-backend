"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../config/logger"));

var _model = _interopRequireDefault(require("../modules/User/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Authenticate = allowedRoles => {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      var token = ctx.cookies.get('access_token');
      var doc = yield _model.default.findByToken(token);

      if (!doc) {
        (0, _logger.default)("[Authentication] no user found for token");
        ctx.body = "[Authentication] no user found for token";
        return false;
      }

      if (!allowedRoles.find(role => role === doc.role)) {
        (0, _logger.default)("[Authentication] DENIED - not in security groups ".concat(allowedRoles));
        ctx.body = "[Authentication] DENIED - not in security groups ".concat(allowedRoles);
        return false;
      }

      (0, _logger.default)("[Authentication] APPROVED - user is in 1 of secury groups ".concat(allowedRoles));
      ctx.body = "[Authentication] APPROVED - user is in 1 of secury groups ".concat(allowedRoles);
      return next();
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

var _default = Authenticate;
exports.default = _default;