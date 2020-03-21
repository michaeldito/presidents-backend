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
  return describe('#calculateSkips()', function () {
    it('single skip', /*#__PURE__*/_asyncToGenerator(function* () {
      var handToBeat = yield _model.default.find({
        shortHand: 'ASpades'
      });
      var cards = yield _model.default.find({
        shortHand: 'AHearts'
      });

      var skips = _model2.default.calculateSkips(handToBeat, cards);

      (0, _expect.default)(skips).toBe(1);
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

      (0, _expect.default)(skips).toBe(2);
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

      (0, _expect.default)(skips).toBe(3);
    }));
    it('no skip', /*#__PURE__*/_asyncToGenerator(function* () {
      var handToBeat = yield _model.default.find({
        shortHand: 'ASpades'
      });
      var cards = yield _model.default.find({
        shortHand: '2Hearts'
      });

      var skips = _model2.default.calculateSkips(handToBeat, cards);

      (0, _expect.default)(skips).toBe(0);
    }));
  });
});

exports.default = _default;