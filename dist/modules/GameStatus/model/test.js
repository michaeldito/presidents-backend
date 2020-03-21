"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _ = _interopRequireDefault(require("./"));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({});
    if (count === 3) return Promise.resolve();

    var instances = _data.default.map(status => new _.default(status));

    var promises = instances.map(instance => instance.save());
    yield Promise.all(promises);
  });

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

exports.init = init;

var drop = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    yield _.default.deleteMany({});
  });

  return function drop() {
    return _ref2.apply(this, arguments);
  };
}();

exports.drop = drop;

var test = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* () {
    return describe('GameStatus', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.close();
      }));
      it('Verify init() initializes 3 game status documents', /*#__PURE__*/_asyncToGenerator(function* () {
        yield init();
        var docs = yield _.default.find({});
        (0, _expect.default)(docs.length).toBe(3);
      }));
      it('Verify findByStatus(status) returns correct game status document', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _.default.findByValue('IN_PROGRESS');
        (0, _expect.default)(doc.value).toBe('IN_PROGRESS');
        doc = yield _.default.findByValue('NOT_STARTED');
        (0, _expect.default)(doc.value).toBe('NOT_STARTED');
        doc = yield _.default.findByValue('FINALIZED');
        (0, _expect.default)(doc.value).toBe('FINALIZED');
      }));
      it('Verify drop() deletes all game status documents', /*#__PURE__*/_asyncToGenerator(function* () {
        yield drop();
        var docs = yield _.default.find({});
        (0, _expect.default)(docs.length).toBe(0);
      }));
    });
  });

  return function test() {
    return _ref3.apply(this, arguments);
  };
}();

exports.test = test;
var Test = {
  init,
  drop,
  test
};
var _default = Test;
exports.default = _default;