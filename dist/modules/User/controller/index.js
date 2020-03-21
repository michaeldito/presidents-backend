"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.profile = exports.login = exports.register = exports.getOne = exports.getAll = void 0;

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _Transaction = _interopRequireDefault(require("../../../utils/Transaction"));

var _model = _interopRequireDefault(require("../../Presidents/model"));

var _model2 = _interopRequireDefault(require("../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getAll = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@GET('users/')]");

    try {
      var docs = yield _model2.default.find({});
      var body = {
        total: docs.length,
        data: docs
      };
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function getAll(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getAll = getAll;

var getOne = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@GET('users/:id')]");
    var {
      id
    } = ctx.params;

    try {
      var doc = yield _model2.default.findById(id);
      var body = doc.toObject();
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function getOne(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getOne = getOne;

var register = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@POST('users/register')]");
    var {
      username,
      email,
      password
    } = ctx.request.body;
    (0, _logger.default)("username: ".concat(username));
    var role = username === 'jack' ? 'Admin' : 'Player';
    var user = {
      username,
      email,
      password,
      gamesPlayed: [],
      role
    };

    try {
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        user = yield _model2.default.register(user);
        var cookieExpiration = Date.now() + 20 * 60 * 1000;
        var options = {
          type: 'web',
          exp: Math.floor(cookieExpiration / 1000 + 60 * 1),
          // expire the access_token 1m after the cookie
          _id: user._id.toHexString()
        };
        var token = yield user.generateAuthToken(options);
        ctx.cookies.set('access_token', token, {
          httpOnly: true,
          expires: new Date(cookieExpiration)
        });
      }));

      var body = _objectSpread({}, user.toObject(), {
        loggedIn: true,
        registered: true
      });

      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function register(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.register = register;

var login = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('users/login')]");
    var {
      username,
      password
    } = ctx.request.body;
    var credentials = {
      username,
      password
    };
    ctx.app.emit('log', JSON.stringify({
      service: {
        name: 'User',
        operation: {
          path: '/login',
          methodType: 'PUT',
          controller: {
            params: [],
            body: {
              username,
              password
            }
          }
        }
      }
    }), ctx);

    try {
      var user = yield _model2.default.findByCredentials(credentials);
      var cookieExpiration = Date.now() + 20 * 60 * 1000;
      var options = {
        type: 'web',
        exp: Math.floor(cookieExpiration / 1000 + 60 * 1),
        // expire the access_token 1m after the cookie
        _id: user._id.toHexString(),
        access: 'user'
      };
      var token = yield user.generateAuthToken(options);
      ctx.cookies.set('access_token', token, {
        httpOnly: true,
        expires: new Date(cookieExpiration)
      });

      var body = _objectSpread({}, user.toObject(), {
        loggedIn: true
      });

      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function login(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.login = login;

var profile = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (ctx) {
    var {
      id
    } = ctx.params;

    try {
      var {
        username,
        email,
        gamesPlayed
      } = yield _model2.default.findById(id);
      var results = yield _model.default.find({
        gamesPlayed: {
          $in: gamesPlayed
        }
      });
      results = results.map(result => {
        var {
          politicalRank,
          nextGameRank
        } = result;
        return {
          politicalRank,
          nextGameRank
        };
      });
      var body = {
        username,
        email,
        results
      };
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function profile(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

exports.profile = profile;