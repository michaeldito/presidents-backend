"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expect = _interopRequireDefault(require("expect"));

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
  return describe('#processTurn()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      var status = yield _model3.default.findByValue('IN_PROGRESS');
      var config = yield _model2.default.findOne({
        name: 'Presidents'
      });
      this.user1 = yield _model5.default.findByUsername('tommypastrami');
      this.user2 = yield _model5.default.findByUsername('bella');
      this.user3 = yield _model5.default.findByUsername('tony');
      var user1 = this.user1._id;
      var user2 = this.user2._id;
      var user3 = this.user3._id;
      var currentPlayer = user2;
      var createdBy = currentPlayer;
      var name = 'process turn prez game';
      var jackHearts = yield _model.default.findOne({
        shortHand: 'JHearts'
      });
      var aceSpades = yield _model.default.findOne({
        shortHand: 'ASpades'
      });
      var jackDiamonds = yield _model.default.findOne({
        shortHand: 'JDiamonds'
      });
      var jackClubs = yield _model.default.findOne({
        shortHand: 'JClubs'
      });
      var twoClubs = yield _model.default.findOne({
        shortHand: '2Clubs'
      });
      this.jackHearts = jackHearts;
      this.aceSpades = aceSpades;
      this.jackDiamonds = jackDiamonds;
      this.jackClubs = jackClubs;
      this.twoClubs = twoClubs;
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
      var player1 = {
        user: user1,
        joinedAt: new Date(),
        seatPosition: 0,
        hand: [jackClubs],
        drinksDrunk: 0,
        drinksReceived: [],
        drinksSent: []
      };
      var player2 = {
        user: user2,
        joinedAt: new Date(),
        seatPosition: 1,
        hand: [aceSpades],
        drinksDrunk: 0,
        drinksReceived: [],
        drinksSent: []
      };
      var player3 = {
        user: user3,
        joinedAt: new Date(),
        seatPosition: 2,
        hand: [twoClubs],
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
        currentPlayer,
        handToBeat: [jackHearts],
        rounds: [{
          turns: []
        }],
        players: [player1, player2, player3]
      };
      yield _model6.default.create(game);
    }));
    describe('successful', function () {
      it('adds a turn to last round', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        var aceSpades = yield _model.default.findOne({
          shortHand: 'ASpades'
        });
        var turn = {
          user: this.user2._id,
          cardsPlayed: [aceSpades],
          wasPassed: false,
          wasSkipped: false,
          didCauseSkips: false,
          skipsRemaining: false,
          endedRound: false
        };
        yield doc.processTurn(turn);
        (0, _expect.default)(doc.rounds[0].turns.length).toBe(1);
      }));
      it('if turn contained cards they are removed from players hand', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        var lastPlayer = doc.players.find(player => player.user.equals(this.user2._id));
        (0, _expect.default)(lastPlayer.hand.length).toBe(0);
      }));
      it('should set next player correctly', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        (0, _expect.default)(doc.currentPlayer.toString()).toBe(this.user3._id.toString());
      }));
      it('if player has no more cards then it should assign rank for next round', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        var firstPlayerDone = doc.players.find(player => player.user.equals(this.user2._id));
        (0, _expect.default)(firstPlayerDone.nextGameRank.name).toBe('President');
      }));
      it('if player plays a 2 it ends the round', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        var roundLengthBeforeTurn = doc.rounds.length;
        var turn = {
          user: this.user3._id,
          cardsPlayed: [this.twoClubs],
          wasPassed: false,
          wasSkipped: false,
          didCauseSkips: false,
          skipsRemaining: false,
          endedRound: true
        };
        yield doc.processTurn(turn);
        doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        var roundLengthAfterTurn = doc.rounds.length;
        (0, _expect.default)(roundLengthAfterTurn).toBe(roundLengthBeforeTurn + 1);
      }));
      it('if only 1 other player has cards it finalizes the game and sets asshole', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'process turn prez game'
        });
        (0, _expect.default)(doc.status.value).toBe('FINALIZED');
        var lastPlacePlayer = doc.players.find(player => player.user.equals(this.user1._id));
        (0, _expect.default)(lastPlacePlayer.nextGameRank.name).toBe('Asshole');
      }));
    });
    describe('skips successful', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {// create a new game with 2 players
        // give 1 player []
        // give 1 player []
      }));
      it('1 skip', /*#__PURE__*/_asyncToGenerator(function* () {// given current handToBeat is a 3
        // when next player plays a 3
        // then game.turns should contain a skip turn
        // expect the skip turn to be for other player
        // then game.currentPlayer should be the same player
      }));
      it('2 skip', /*#__PURE__*/_asyncToGenerator(function* () {// given current handToBeat is a 3
        // when next player plays two 3's
        // then game.turns should contain two skip turns
        // then game.currentPlayer should be the other player
        // expect the 1 skip to be for player1 and 1 for player2
      }));
      it('3 skip', /*#__PURE__*/_asyncToGenerator(function* () {// given current handToBeat is a 3
        // when next player plays three 3's
        // then game.turns should contain three skip turns
        // then game.currentPlayer should be the other player
        // expect 2 skips for player2 and 1 skip for player1
      }));
    });
    describe('players last turn ended the round', function () {
      it('true', /*#__PURE__*/_asyncToGenerator(function* () {}));
      it('false', /*#__PURE__*/_asyncToGenerator(function* () {}));
    });
  });
});

exports.default = _default;