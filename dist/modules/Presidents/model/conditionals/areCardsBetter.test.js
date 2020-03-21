"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _model = _interopRequireDefault(require("../../../Card/model"));

var _model2 = _interopRequireDefault(require("../../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/_asyncToGenerator(function* () {
  return describe('#areCardsBetter()', function () {
    describe('true', function () {
      it('current hand has more cards', /*#__PURE__*/_asyncToGenerator(function* () {
        var handToBeat = yield _model.default.find({
          shortHand: '4Diamonds'
        });
        var threeHearts = yield _model.default.findOne({
          shortHand: '4Hearts'
        });
        var threeSpades = yield _model.default.findOne({
          shortHand: '4Spades'
        });
        var cards = [threeHearts, threeSpades];
        var isTurnBetter;

        try {
          isTurnBetter = yield _model2.default.areCardsBetter(handToBeat, cards);
        } catch (err) {}

        (0, _expect.default)(isTurnBetter).toBeTruthy();
      }));
      it('current hand has equal number of cards with same rank', /*#__PURE__*/_asyncToGenerator(function* () {
        var handToBeat = yield _model.default.find({
          shortHand: '4Diamonds'
        });
        var cards = yield _model.default.find({
          shortHand: '4Hearts'
        });
        var isTurnBetter;

        try {
          isTurnBetter = yield _model2.default.areCardsBetter(handToBeat, cards);
        } catch (err) {}

        (0, _expect.default)(isTurnBetter).toBeTruthy();
      }));
      it('current hand has equal number of cards with a better rank', /*#__PURE__*/_asyncToGenerator(function* () {
        var handToBeat = yield _model.default.find({
          shortHand: '4Diamonds'
        });
        var cards = yield _model.default.find({
          shortHand: '5Hearts'
        });
        var isTurnBetter;

        try {
          isTurnBetter = yield _model2.default.areCardsBetter(handToBeat, cards);
        } catch (err) {}

        (0, _expect.default)(isTurnBetter).toBeTruthy();
      }));
      it('current hand has fewer cards but contains a two', /*#__PURE__*/_asyncToGenerator(function* () {
        var fourDiamonds = yield _model.default.findOne({
          shortHand: '4Diamonds'
        });
        var fourHearts = yield _model.default.findOne({
          shortHand: '4Hearts'
        });
        var handToBeat = [fourDiamonds, fourHearts];
        var cards = yield _model.default.find({
          shortHand: '2Hearts'
        });
        var isTurnBetter;

        try {
          isTurnBetter = yield _model2.default.areCardsBetter(handToBeat, cards);
        } catch (err) {}

        (0, _expect.default)(isTurnBetter).toBeTruthy();
      }));
    });
    describe('false', function () {
      it("current turn's rank does not beat previous turns rank", /*#__PURE__*/_asyncToGenerator(function* () {
        var handToBeat = yield _model.default.find({
          shortHand: '4Hearts'
        });
        var cards = yield _model.default.find({
          shortHand: '3Hearts'
        });
        var isTurnBetter;

        try {
          isTurnBetter = yield _model2.default.areCardsBetter(handToBeat, cards);
        } catch (err) {
          (0, _expect.default)(err.message).toBe("The rank of the selected cards does not beat the previous turns.");
        }
      }));
      it('not enough cards selected (not a 2)', /*#__PURE__*/_asyncToGenerator(function* () {
        var fourHearts = yield _model.default.findOne({
          shortHand: '4Hearts'
        });
        var fourSpades = yield _model.default.findOne({
          shortHand: '4Spades'
        });
        var handToBeat = [fourHearts, fourSpades];
        var cards = yield _model.default.find({
          shortHand: '5Hearts'
        });
        var isTurnBetter;

        try {
          isTurnBetter = yield _model2.default.areCardsBetter(handToBeat, cards);
        } catch (err) {
          (0, _expect.default)(err.message).toBe("The selected cards contain fewer cards than the previous turn, and does not contain a two.");
        }
      }));
    });
  });
});

exports.default = _default;