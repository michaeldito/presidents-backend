"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _model = _interopRequireDefault(require("../../../Card/model"));

var _model2 = _interopRequireDefault(require("../../../GameConfiguration/model"));

var _model3 = _interopRequireDefault(require("../../../GameStatus/model"));

var _model4 = _interopRequireDefault(require("../../../PoliticalRank/model"));

var _model5 = _interopRequireDefault(require("../../../User/model"));

var _model6 = _interopRequireDefault(require("../../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/_asyncToGenerator(function* () {
  return describe('#initializeNextRound()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      var status = yield _model3.default.findByValue('FINALIZED');
      var config = yield _model2.default.findOne({
        name: 'Presidents'
      });
      var currentPlayer = yield _model5.default.findByUsername('tommypastrami');
      var createdBy = currentPlayer;
      var hand = yield _model.default.find({}).limit(5);
      var user = currentPlayer;
      var name = 'next round prez game';
      var rules = {
        doubleSkips: false,
        scumStarts: false,
        scumHandsTwo: false,
        oneEyedJacksAndKingOfHearts: false,
        reversePresidentScumTrade: false,
        presidentDeals: false,
        goLow: false,
        equalNumber: false,
        noEndOnBomb: false,
        tripleSixes: false,
        passOut: false,
        fourInARow: false,
        larryPresidents: true
      };
      var winner = user;
      var politicalRank = yield _model4.default.findByName('President');
      var nextGameRank = politicalRank;
      var drinksDrunk = 0;
      var drinksReceived = [{
        createdAt: new Date(),
        sentBy: user
      }];
      var drinksSent = [{
        createdAt: new Date(),
        sentTo: user
      }];
      var player = {
        user,
        joinedAt: new Date(),
        seatPosition: 1,
        hand,
        politicalRank,
        nextGameRank,
        drinksDrunk,
        drinksReceived,
        drinksSent
      };
      var game = {
        winner,
        createdBy,
        name,
        status,
        config,
        rules,
        currentPlayer,
        rounds: [],
        players: [player, player]
      };
      yield _model6.default.create(game);
    }));
    describe('validations', function () {
      it('cannot start next round if game status is finalized', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'next round prez game'
        });
        var message = 'Unable to start next round. The game is finalized.';

        try {
          yield doc.initializeNextRound();
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
    });
    describe('successful', function () {
      it('should have added a new round and with a startedAt date', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'next round prez game'
        });
        doc.status = yield _model3.default.findByValue('NOT_STARTED');
        yield doc.save();

        try {
          doc = yield _model6.default.findOne({
            name: 'next round prez game'
          });
          yield doc.initializeNextRound();
          doc = yield _model6.default.findOne({
            name: 'next round prez game'
          });
          (0, _expect.default)(doc.rounds.length).toBe(1);
          (0, _expect.default)(doc.rounds[0].startedAt).toBeTruthy();
        } catch (err) {
          (0, _expect.default)(err).toBeFalsy();
        }
      }));
      it('should set game status to in progress if this is round one', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'next round prez game'
        });
        (0, _expect.default)(doc.status.value).toBe('IN_PROGRESS');
      }));
    });
  });
});

exports.default = _default;