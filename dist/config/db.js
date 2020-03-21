"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.close = exports.connect = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("./config"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _config.default)();

var connect = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    };
    _mongoose.default.Promise = global.Promise;

    try {
      yield _mongoose.default.connect(process.env.MONGODB_URI, options);
      console.log('[Database] connected to mongodb');
    } catch (err) {
      (0, _logger.default)('[Database] failed to connect to mongodb');
      (0, _logger.default)("[Database] error: ".concat(err));
    }
  });

  return function connect() {
    return _ref.apply(this, arguments);
  };
}();

exports.connect = connect;

var close = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    try {
      yield _mongoose.default.connection.close();
      console.log('[Database] disconnected from mongodb');
    } catch (err) {
      (0, _logger.default)('[Database] failed to disconnect from mongodb');
      (0, _logger.default)("[Database] error: ".concat(err));
    }
  });

  return function close() {
    return _ref2.apply(this, arguments);
  };
}();

exports.close = close;
var db = {
  connect,
  close
};
var _default = db;
exports.default = _default;