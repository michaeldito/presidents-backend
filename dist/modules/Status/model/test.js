"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _ = _interopRequireDefault(require("."));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({
      kind: 'Status'
    });
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
    return describe('Status', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it initializes 3 status documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(3);
        }));
        describe('validations', function () {
          it('value is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var status = {};
            var instance = new _.default(status);
            var error = instance.validateSync();
            var message = 'A Status must have a value to be created.';
            (0, _expect.default)(error.errors.value.message).toBe(message);
          }));
          it('value must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var status = {
              value: 'A'
            };
            var instance = new _.default(status);
            var message = 'Error, expected `value` to be unique. Value: `A`';
            instance.save(error => {
              (0, _expect.default)(error.errors.value.message).toBe(message);
            });
          }));
        });
      });
      describe('findByValue(value)', function () {
        it('Verify it returns correct status document', /*#__PURE__*/_asyncToGenerator(function* () {
          var doc = yield _.default.findByValue('A');
          (0, _expect.default)(doc.value).toBe('A');
          doc = yield _.default.findByValue('B');
          (0, _expect.default)(doc.value).toBe('B');
          doc = yield _.default.findByValue('C');
          (0, _expect.default)(doc.value).toBe('C');
        }));
      });
      describe('#drop()', function () {
        it('Verify it deletes all game status documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield drop();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(0);
        }));
      });
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