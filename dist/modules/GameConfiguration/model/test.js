"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _model = _interopRequireDefault(require("../../../modules/Card/model"));

var _test = require("../../../modules/Card/model/test");

var _model2 = _interopRequireDefault(require("../../../modules/CardRank/model"));

var _test2 = require("../../../modules/CardRank/model/test");

var _test3 = require("../../../modules/Suit/model/test");

var _ = _interopRequireDefault(require("./"));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({});
    if (count === 3) return Promise.resolve();
    var deck = yield _model.default.getDeck();

    var configs = _data.default.map(config => _objectSpread({}, config, {
      deck
    }));

    var instances = configs.map(config => new _.default(config));
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
    return describe('GameConfiguration', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
        yield (0, _test2.init)();
        yield (0, _test3.init)();
        yield (0, _test.init)();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield (0, _test.drop)();
        yield (0, _test2.drop)();
        yield (0, _test3.drop)();
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it initializes 3 game configuration documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(3);
        }));
        describe('validations', function () {
          it('name is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var card = yield _model.default.findOne({});
            var config = {
              maxPlayers: 1,
              deck: [card],
              numDecks: 1
            };
            var instance = new _.default(config);
            var error = instance.validateSync();
            var message = 'A name is required for every game configuration.';
            (0, _expect.default)(error.errors.name.message).toBe(message);
          }));
          it('name must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var card = yield _model.default.findOne({});
            var config = {
              name: 'Presidents',
              maxPlayers: 1,
              deck: [card],
              numDecks: 1
            };
            var instance = new _.default(config);
            var message = 'Error, expected `name` to be unique. Value: `Presidents`';
            instance.save(error => {
              (0, _expect.default)(error.errors.name.message).toBe(message);
            });
          }));
          it('maxPlayers is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var card = yield _model.default.findOne({});
            var config = {
              name: 'name',
              deck: [card],
              numDecks: 1
            };
            var instance = new _.default(config);
            var error = instance.validateSync();
            var message = 'A maxPlayers field is required for every game configuration.';
            (0, _expect.default)(error.errors.maxPlayers.message).toBe(message);
          }));
          it('maxPlayers must be >= minPlayers', /*#__PURE__*/_asyncToGenerator(function* () {}));
          it('minPlayers must be <= maxPlayers', /*#__PURE__*/_asyncToGenerator(function* () {}));
          it('deck must not be empty', /*#__PURE__*/_asyncToGenerator(function* () {
            var config = {
              name: 'name',
              maxPlayers: 1,
              numDecks: 1,
              deck: []
            };
            var instance = new _.default(config);
            var message = 'empty deck';
            instance.validate(error => {
              (0, _expect.default)(error.errors.deck.reason.message).toBe(message);
            });
          }));
          it('deck must be array of Card instances', /*#__PURE__*/_asyncToGenerator(function* () {
            var rank = yield _model2.default.findOne({});
            var card = yield _model.default.findOne({});
            var config = {
              name: 'name',
              maxPlayers: 1,
              numDecks: 1,
              deck: [rank, card]
            };
            var instance = new _.default(config);
            var message = 'objectId does not reference a card';
            instance.validate(error => {
              (0, _expect.default)(error.errors.deck.reason.message).toBe(message);
            });
          }));
          it('numDecks is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var card = yield _model.default.findOne({});
            var config = {
              name: 'name',
              maxPlayers: 1,
              deck: [card]
            };
            var instance = new _.default(config);
            var error = instance.validateSync();
            var message = 'A numDecks field is required for every game configuration.';
            (0, _expect.default)(error.errors.numDecks.message).toBe(message);
          }));
        });
      });
      describe('#drop()', function () {
        it('verify it deletes all game configuration documents', /*#__PURE__*/_asyncToGenerator(function* () {
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