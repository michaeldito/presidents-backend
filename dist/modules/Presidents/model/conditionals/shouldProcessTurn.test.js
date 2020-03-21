"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _ = _interopRequireDefault(require("../"));

var _model = _interopRequireDefault(require("../../../Card/model"));

var _model2 = _interopRequireDefault(require("../../../GameConfiguration/model"));

var _model3 = _interopRequireDefault(require("../../../GameStatus/model"));

var _model4 = _interopRequireDefault(require("../../../PoliticalRank/model"));

var _model5 = _interopRequireDefault(require("../../../User/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/_asyncToGenerator(function* () {
  return describe('#shouldProcessTurn()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      var status = yield _model3.default.findByValue('NOT_STARTED');
      var config = yield _model2.default.findOne({
        name: 'Presidents'
      });
      var currentPlayer = yield _model5.default.findByUsername('tommypastrami');
      var createdBy = currentPlayer;
      var user = currentPlayer;
      var name = 'shd process game';
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
      var game = {
        createdBy,
        name,
        status,
        config,
        rules
      };
      yield _.default.create(game);
    }));
    after( /*#__PURE__*/_asyncToGenerator(function* () {
      yield _.default.findOneAndDelete({
        name: 'shd process game'
      });
    }));
    describe('true', function () {
      it('current hand is better', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _.default.findOne({
          name: 'shd process game'
        });
        var user1 = yield _model5.default.findByUsername('tommypastrami');
        var user2 = yield _model5.default.findByUsername('jethro');
        doc = yield doc.join(user1);
        doc = yield doc.join(user2);
        doc = yield doc.initialize();
        doc = yield doc.initializeNextRound();
        var threeClubs = yield _model.default.findOne({
          shortHand: '3Clubs'
        });
        var sevenHearts = yield _model.default.findOne({
          shortHand: '7Hearts'
        });
        var turn = {
          user: doc.currentPlayer,
          cardsPlayed: [threeClubs],
          wasPassed: false,
          wasSkipped: false,
          didCauseSkips: false,
          skipsRemaining: 0,
          endedRound: false
        };
        doc = yield doc.processTurn(turn);
        turn = {
          user: doc.currentPlayer,
          cardsPlayed: [sevenHearts],
          wasPassed: false
        };
        var shouldProcess;

        try {
          shouldProcess = yield doc.shouldProcessTurn(turn);
        } catch (err) {
          console.log(err);
        }

        (0, _expect.default)(shouldProcess).toBeTruthy();
      }));
    });
    describe('false', function () {
      it('not your turn', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _.default.findOne({
          name: 'shd process game'
        });
        var turn = {
          user: '1234',
          cardsPlayed: [],
          wasPassed: true
        };
        var shouldProcess;

        try {
          shouldProcess = yield doc.shouldProcessTurn(turn);
        } catch (err) {
          (0, _expect.default)(err.message).toBe("Unable to process turn. It is not your turn.");
        }
      }));
      it('invalid cards', /*#__PURE__*/_asyncToGenerator(function* () {
        var sevenHearts = yield _model.default.findOne({
          shortHand: '7Hearts'
        });
        var eightHearts = yield _model.default.findOne({
          shortHand: '8Hearts'
        });
        var doc = yield _.default.findOne({
          name: 'shd process game'
        });
        var turn = {
          user: doc.currentPlayer,
          cardsPlayed: [sevenHearts, eightHearts],
          wasPassed: true
        };
        var shouldProcess;

        try {
          shouldProcess = yield doc.shouldProcessTurn(turn);
        } catch (err) {
          (0, _expect.default)(err.message).toBe("Unable to process turn. The cards selected are invalid.");
        }
      }));
      it('cards are not better', /*#__PURE__*/_asyncToGenerator(function* () {
        var fourClubs = yield _model.default.findOne({
          shortHand: '4Clubs'
        });
        var doc = yield _.default.findOne({
          name: 'shd process game'
        });
        var turn = {
          user: doc.currentPlayer,
          cardsPlayed: [fourClubs],
          wasPassed: false,
          wasSkipped: false,
          didCauseSkips: false,
          skipsRemaining: 0,
          endedRound: false
        };
        doc = yield doc.processTurn(turn);
        var threeSpades = yield _model.default.findOne({
          shortHand: '3Spades'
        });
        turn = {
          user: doc.currentPlayer,
          cardsPlayed: [threeSpades],
          wasPassed: false
        };
        var shouldProcess;

        try {
          shouldProcess = yield doc.shouldProcessTurn(turn);
        } catch (err) {
          (0, _expect.default)(err.message).toBe("Unable to process turn. The rank of the selected cards does not beat the previous turns.");
        }
      }));
    });
  });
});

exports.default = _default;