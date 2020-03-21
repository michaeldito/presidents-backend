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
    if (count === 8) return Promise.resolve();

    var instances = _data.default.map(rank => new _.default(rank));

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
    return describe('PoliticalRank', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it initializes 8 political rank documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(8);
        }));
        describe('validations', function () {
          it('name is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var rank = {
              value: -1
            };
            var instance = new _.default(rank);
            var message = 'A name is required to create a political rank.';
            var error = instance.validateSync();
            (0, _expect.default)(error.errors.name.message).toBe(message);
          }));
          it('name must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var rank = {
              name: 'President',
              value: -1
            };
            var instance = new _.default(rank);
            var message = 'Error, expected `name` to be unique. Value: `President`';
            instance.save(error => {
              (0, _expect.default)(error.errors.name.message).toBe(message);
            });
          }));
          it('value is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var rank = {
              name: 'some name'
            };
            var instance = new _.default(rank);
            var message = 'A value is required to create a political rank.';
            var error = instance.validateSync();
            (0, _expect.default)(error.errors.value.message).toBe(message);
          }));
          it('value must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var rank = {
              name: 'some name',
              value: 1
            };
            var instance = new _.default(rank);
            var message = 'Error, expected `value` to be unique. Value: `1`';
            instance.save(error => {
              (0, _expect.default)(error.errors.value.message).toBe(message);
            });
          }));
        });
      });
      describe('#findByName(name)', function () {
        it('verify it returns correct political rank document', /*#__PURE__*/_asyncToGenerator(function* () {
          var doc;

          for (var rank of _data.default) {
            doc = yield _.default.findByName(rank.name);
            (0, _expect.default)(doc.name).toBe(rank.name);
          }
        }));
      });
      describe('#findByValue(value)', function () {
        it('verify it returns correct political rank document', /*#__PURE__*/_asyncToGenerator(function* () {
          var doc;

          for (var rank of _data.default) {
            doc = yield _.default.findByValue(rank.value);
            (0, _expect.default)(doc.value).toBe(rank.value);
          }
        }));
      });
      describe('#getRanks(howMany)', function () {
        it('verify it returns correct number of ranks', /*#__PURE__*/_asyncToGenerator(function* () {
          var docs = yield _.default.getRanks(8);
          (0, _expect.default)(docs.length).toBe(8);
        }));
      });
      describe('#drop()', function () {
        it('verify it deletes all political rank documents', /*#__PURE__*/_asyncToGenerator(function* () {
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