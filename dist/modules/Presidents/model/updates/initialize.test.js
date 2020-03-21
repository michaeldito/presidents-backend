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
  return describe('#initialize()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      var status = yield _model3.default.findByValue('IN_PROGRESS');
      var config = yield _model2.default.findOne({
        name: 'Presidents'
      });
      var currentPlayer = yield _model5.default.findByUsername('tommypastrami');
      var createdBy = currentPlayer;
      var cardsPlayed = yield _model.default.find({
        shortHand: '3Clubs'
      });
      var hand = yield _model.default.find({}).limit(5);
      var user = currentPlayer;
      var name = 'initialize prez game';
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
        rounds: [{
          startedAt: new Date(),
          turns: [{
            wasPassed: false,
            wasSkipped: false,
            didCauseSkips: false,
            skipsRemaining: 0,
            endedRound: false,
            user,
            takenAt: new Date(),
            cardsPlayed
          }]
        }],
        players: [player]
      };
      yield _model6.default.create(game);
    }));
    describe('validations', function () {
      it('cannot start a game that is in progress', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'initialize prez game'
        });
        var message = 'Unable to start game. It is already in progress.';

        try {
          yield doc.initialize();
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('cannot start a game that has finished', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'initialize prez game'
        });
        doc.status = yield _model3.default.findByValue('FINALIZED');
        yield doc.save();
        doc = yield _model6.default.findOne({
          name: 'initialize prez game'
        });
        var message = 'Unable to start game. It has already finished.';

        try {
          yield doc.initialize();
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('cannot start a game that does not have minimum number of players', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'initialize prez game'
        });
        doc.status = yield _model3.default.findByValue('NOT_STARTED');
        yield doc.save();
        doc = yield _model6.default.findOne({
          name: 'initialize prez game'
        });
        var message = 'Unable to start game. Minimum number of players is 2.';

        try {
          yield doc.initialize();
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
    });
    describe('successful', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        var status = yield _model3.default.findByValue('NOT_STARTED');
        var config = yield _model2.default.findOne({
          name: 'Presidents'
        });
        var currentPlayer = yield _model5.default.findByUsername('tommypastrami');
        var user2 = yield _model5.default.findByUsername('bella');
        var createdBy = currentPlayer;
        var user = currentPlayer;
        var name = 'successful initialize prez game';
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
        var politicalRank = yield _model4.default.findByName('President');
        var player1 = {
          user,
          joinedAt: new Date(),
          seatPosition: 0,
          politicalRank,
          drinksDrunk: 0,
          drinksReceived: [],
          drinksSent: []
        };
        var player2 = {
          user: user2,
          joinedAt: new Date(),
          seatPosition: 1,
          politicalRank,
          drinksDrunk: 0,
          drinksReceived: [],
          drinksSent: []
        };
        var game = {
          createdBy,
          name,
          status,
          config,
          rules,
          players: [player1, player2]
        };
        yield _model6.default.create(game);
      }));
      it('game with 2 players means players should have been dealt 26 cards each', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'successful initialize prez game'
        });

        try {
          yield doc.initialize();
          (0, _expect.default)(doc.players[0].hand.length).toBe(26);
          (0, _expect.default)(doc.players[1].hand.length).toBe(26);
        } catch (err) {
          console.log(err);
        }
      }));
      it('game.currentPlayer should have 3 ♣', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'successful initialize prez game'
        });
        var {
          players
        } = doc;
        var currentPlayer = players.find(player => player.user._id.equals(doc.currentPlayer));
        (0, _expect.default)(currentPlayer.hand.find(card => card.shortHand === '3Clubs')).toBeTruthy();
      }));
    });
  });
});

exports.default = _default;