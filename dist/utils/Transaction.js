"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _logger = _interopRequireDefault(require("../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (fn) {
    (0, _logger.default)('[Transaction] beginning session');
    var session = yield _mongoose.default.startSession();

    try {
      (0, _logger.default)('[Transaction] beginning transaction');
      session.startTransaction();
      yield fn();
      (0, _logger.default)('[Transaction] committing transaction');
      yield session.commitTransaction();
      (0, _logger.default)('[Transaction] transaction complete');
    } catch (err) {
      yield session.abortTransaction();
      (0, _logger.default)('[Transaction] transaction aborted');
      (0, _logger.default)(err);
      throw err;
    } finally {
      (0, _logger.default)('[Transaction] ending session');
      session.endSession();
    }
  });
  return _ref.apply(this, arguments);
}