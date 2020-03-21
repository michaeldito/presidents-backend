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

var GameMembership = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    var token = ctx.cookies.get('access_token');
    var {
      id
    } = ctx.params;
    var doc = yield _model.default.findByToken(token);

    if (!doc) {
      (0, _logger.default)("[GameMembership] DENIED - no user found for token");
      ctx.body = "[GameMembership] DENIED - no user found for token";
      return false;
    }

    var isMember = doc.gamesPlayed.find(game => game._id === id);

    if (isMember) {
      (0, _logger.default)("[GameMembership] DENIED - user is not a member of the game");
      ctx.body = "[GameMembership] DENIED - user is not a member of the game";
      return false;
    }

    (0, _logger.default)("[GameMembership] APPROVED - user is a member of the game");
    ctx.body = "[GameMembership] APPROVED - user is a member of the game";
    return next();
  });

  return function GameMembership(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = GameMembership;
exports.default = _default;