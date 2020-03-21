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
    var count = yield _.default.countDocuments({});
    if (count === 4) return Promise.resolve();

    var instances = _data.default.map(suit => new _.default(suit));

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
    return describe('Suit', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify init() initializes 4 suit documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(4);
        }));
        describe('validations', function () {
          it('name is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              color: 'Black',
              character: '1234',
              value: 0
            };
            var instance = new _.default(suit);
            var error = instance.validateSync();
            var message = 'A name is required for every suit.';
            (0, _expect.default)(error.errors.name.message).toBe(message);
          }));
          it('name must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              name: 'Diamonds',
              color: 'Red',
              character: '\u2666',
              value: 1
            };
            var instance = new _.default(suit);
            var message = 'Error, expected `name` to be unique. Value: `Diamonds`';
            instance.save(error => {
              (0, _expect.default)(error.errors.name.message).toBe(message);
            });
          }));
          it('color is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              name: 'Clubs',
              character: '1234',
              value: 0
            };
            var instance = new _.default(suit);
            var error = instance.validateSync();
            var message = 'A color is required for every suit.';
            (0, _expect.default)(error.errors.color.message).toBe(message);
          }));
          it('character is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              name: 'Clubs',
              color: 'Black',
              value: 0
            };
            var instance = new _.default(suit);
            var error = instance.validateSync();
            var message = 'A character is required for every suit.';
            (0, _expect.default)(error.errors.character.message).toBe(message);
          }));
          it('character must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              name: 'Diamonds',
              color: 'Red',
              character: '\u2666',
              value: 1
            };
            var instance = new _.default(suit);
            var message = 'Error, expected `character` to be unique. Value: `\u2666`';
            instance.save(error => {
              (0, _expect.default)(error.errors.character.message).toBe(message);
            });
          }));
          it('value is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              name: 'Clubs',
              color: 'Black',
              character: '1234'
            };
            var instance = new _.default(suit);
            var error = instance.validateSync();
            var message = 'A value is required for every suit.';
            (0, _expect.default)(error.errors.value.message).toBe(message);
          }));
          it('value must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var suit = {
              name: 'Diamonds',
              color: 'Red',
              character: '\u2666',
              value: 1
            };
            var instance = new _.default(suit);
            var message = 'Error, expected `value` to be unique. Value: `1`';
            instance.save(error => {
              (0, _expect.default)(error.errors.value.message).toBe(message);
            });
          }));
        });
      });
      describe('#findByName(name)', function () {
        it('verify it returns correct suit document', /*#__PURE__*/_asyncToGenerator(function* () {
          var doc = yield _.default.findByName('Hearts');
          (0, _expect.default)(doc.name).toBe('Hearts');
          doc = yield _.default.findByName('Spades');
          (0, _expect.default)(doc.name).toBe('Spades');
          doc = yield _.default.findByName('Diamonds');
          (0, _expect.default)(doc.name).toBe('Diamonds');
          doc = yield _.default.findByName('Clubs');
          (0, _expect.default)(doc.name).toBe('Clubs');
        }));
      });
      describe('#drop()', function () {
        it('verify it deletes all documents', /*#__PURE__*/_asyncToGenerator(function* () {
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