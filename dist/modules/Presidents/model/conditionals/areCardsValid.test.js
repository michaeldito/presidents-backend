"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _ = _interopRequireDefault(require(".."));

var _model = _interopRequireDefault(require("../../../Card/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/_asyncToGenerator(function* () {
  return describe('#areCardsValid()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      this.threeClubs = yield _model.default.findOne({
        shortHand: '3Clubs'
      });
      this.threeHearts = yield _model.default.findOne({
        shortHand: '3Hearts'
      });
      this.fourHearts = yield _model.default.findOne({
        shortHand: '4Hearts'
      });
    }));
    describe('true', function () {
      it('cards are of the same rank', /*#__PURE__*/_asyncToGenerator(function* () {
        var cards = [this.threeClubs, this.threeHearts];

        var valid = _.default.areCardsValid(cards);

        (0, _expect.default)(valid).toBeTruthy();
      }));
    });
    describe('false', function () {
      it('cards are not of the same rank', /*#__PURE__*/_asyncToGenerator(function* () {
        var cards = [this.threeClubs, this.fourHearts];

        var valid = _.default.areCardsValid(cards);

        (0, _expect.default)(valid).toBeFalsy();
      }));
    });
  });
});

exports.default = _default;