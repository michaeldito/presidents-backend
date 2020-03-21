"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _model = _interopRequireDefault(require("../../CardRank/model"));

var _test = require("../../CardRank/model/test");

var _model2 = _interopRequireDefault(require("../../Suit/model"));

var _test2 = require("../../Suit/model/test");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({});
    if (count === 52) return Promise.resolve();
    var suits = yield _model2.default.find({});
    if (suits.length !== 4) return Promise.reject(new Error('Suits not initialized. Cannot create cards.'));
    var cardRanks = yield _model.default.find({});
    if (cardRanks.length !== 13) return Promise.reject(new Error('CardRanks not initialized. Cannot create cards.'));
    var cards = [];

    for (var suit of suits) {
      for (var cardRank of cardRanks) {
        var shortHand = cardRank.character + suit.name;
        cards.push({
          cardRank,
          suit,
          shortHand
        });
      }
    }

    var instances = cards.map(card => new _.default(card));
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
    return describe('Card', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
        yield (0, _test2.init)();
        yield (0, _test.init)();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield (0, _test.drop)();
        yield (0, _test2.drop)();
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it initializes 52 card documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(52);
        }));
        describe('validations', function () {
          it('shortHand is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var cardRank = yield _model.default.findOne({});
            var suit = yield _model2.default.findOne({});
            var card = {
              cardRank,
              suit
            };
            var instance = new _.default(card);
            var error = instance.validateSync();
            var message = 'A shorthand is required for every card.';
            (0, _expect.default)(error.errors.shortHand.message).toBe(message);
          }));
          it('shortHand must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var {
              shortHand,
              cardRank,
              suit
            } = yield _.default.findOne({
              shortHand: '3Clubs'
            });
            var card = {
              shortHand,
              cardRank,
              suit
            };
            var instance = new _.default(card);
            var message = 'Error, expected `shortHand` to be unique. Value: `3Clubs`';
            instance.save(error => {
              (0, _expect.default)(error.errors.shortHand.message).toBe(message);
            });
          }));
          it('cardRank is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var shortHand = 'shortHand';
            var suit = yield _model2.default.findOne({});
            var card = {
              shortHand,
              suit
            };
            var instance = new _.default(card);
            var error = instance.validateSync();
            var message = 'A card rank is required for every card.';
            (0, _expect.default)(error.errors.cardRank.message).toBe(message);
          }));
          it('suit is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var shortHand = 'shortHand';
            var cardRank = yield _model.default.findOne({});
            var card = {
              shortHand,
              cardRank
            };
            var instance = new _.default(card);
            var error = instance.validateSync();
            var message = 'A suit is required for every card.';
            (0, _expect.default)(error.errors.suit.message).toBe(message);
          }));
        });
      });
      describe('#getDeck()', function () {
        it('verify getDeck() returns 52 card documents', /*#__PURE__*/_asyncToGenerator(function* () {
          var deck = yield _.default.getDeck();
          (0, _expect.default)(deck.length).toBe(52);
        }));
      });
      describe('#drop()', function () {
        it('verify drop() deletes all card documents', /*#__PURE__*/_asyncToGenerator(function* () {
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
var _default = {
  init,
  drop,
  test
};
exports.default = _default;