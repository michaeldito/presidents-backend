"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _model = _interopRequireDefault(require("../modules/Card/model"));

var _model2 = _interopRequireDefault(require("../modules/Presidents/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = describe('Utility Tests', function () {
  before( /*#__PURE__*/_asyncToGenerator(function* () {}));
  after( /*#__PURE__*/_asyncToGenerator(function* () {}));
  describe('shuffle(deck)', function () {
    it('Shuffles 52 card object ids', /*#__PURE__*/_asyncToGenerator(function* () {}));
  });
  describe('deal(numPlayers=4, shuffledDeck)', function () {
    it('Creates a an array of length numPlayers each containing 13 cards', /*#__PURE__*/_asyncToGenerator(function* () {}));
  });
  describe('sort(cards)', function () {
    it('Sorts an array of cards by rank', /*#__PURE__*/_asyncToGenerator(function* () {// extract the first four items
      // check if they are equal to v, continue until v = 14 (Ace)
      // let v = 2;
      // while (v < 15) {
      //   let chunk = ranks.splice(0, 4);
      //   for (let peice of chunk) {
      //     expect(peice).toBe(v);
      //   }
      //   v++;
      // }
    }));
  });
  describe('find3Clubs(allPlayerHands)', function () {
    it('Searchs through a 2d array cards, returns index of array with 3♣', /*#__PURE__*/_asyncToGenerator(function* () {}));
    it('Throws exception if 2d array does not contain 3♣', /*#__PURE__*/_asyncToGenerator(function* () {
      var arr = [[{}], [{}], [{}]];

      _assert.default.throws(() => _model2.default.find3Clubs(arr), Error, '4 of Clubs was not in the deck.');
    }));
  });
  _model2.default;
  describe('#calculateSkips()', function () {
    it('single skip', /*#__PURE__*/_asyncToGenerator(function* () {
      var handToBeat = yield _model.default.find({
        shortHand: 'ASpades'
      });
      var cards = yield _model.default.find({
        shortHand: 'AHearts'
      });

      var skips = _model2.default.calculateSkips(handToBeat, cards);

      expect(skips).toBe(1);
    }));
    it('double skip', /*#__PURE__*/_asyncToGenerator(function* () {
      var handToBeat = yield _model.default.find({
        shortHand: 'ASpades'
      });
      var aceHearts = yield _model.default.findOne({
        shortHand: 'AHearts'
      });
      var aceDiamonds = yield _model.default.findOne({
        shortHand: 'ADiamonds'
      });
      var cards = [aceHearts, aceDiamonds];

      var skips = _model2.default.calculateSkips(handToBeat, cards);

      expect(skips).toBe(2);
    }));
    it('triple skip', /*#__PURE__*/_asyncToGenerator(function* () {
      var handToBeat = yield _model.default.find({
        shortHand: 'ASpades'
      });
      var aceHearts = yield _model.default.findOne({
        shortHand: 'AHearts'
      });
      var aceDiamonds = yield _model.default.findOne({
        shortHand: 'ADiamonds'
      });
      var aceClubs = yield _model.default.findOne({
        shortHand: 'AClubs'
      });
      var cards = [aceHearts, aceDiamonds, aceClubs];

      var skips = _model2.default.calculateSkips(handToBeat, cards);

      expect(skips).toBe(3);
    }));
    it('no skip', /*#__PURE__*/_asyncToGenerator(function* () {
      var handToBeat = yield _model.default.find({
        shortHand: 'ASpades'
      });
      var cards = yield _model.default.find({
        shortHand: '2Hearts'
      });

      var skips = _model2.default.calculateSkips(handToBeat, cards);

      expect(skips).toBe(0);
    }));
  });
});

exports.default = _default;