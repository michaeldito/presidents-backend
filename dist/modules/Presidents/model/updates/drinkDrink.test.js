"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = _interopRequireDefault(require("../../../Card/model"));

var _model2 = _interopRequireDefault(require("../../../GameConfiguration/model"));

var _model3 = _interopRequireDefault(require("../../../GameStatus/model"));

var _model4 = _interopRequireDefault(require("../../../PoliticalRank/model"));

var _model5 = _interopRequireDefault(require("../../../User/model"));

var _model6 = _interopRequireDefault(require("../../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var expect = require('expect');

var _default = /*#__PURE__*/_asyncToGenerator(function* () {
  return describe('#drinkDrink()', function () {
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
      var name = 'drinkDrink prez game';
      var jackHearts = yield _model.default.findOne({
        shortHand: 'JHearts'
      });
      var aceSpades = yield _model.default.findOne({
        shortHand: 'ASpades'
      });
      var aceHearts = yield _model.default.findOne({
        shortHand: 'AHearts'
      });
      var jackDiamonds = yield _model.default.findOne({
        shortHand: 'JDiamonds'
      });
      var jackClubs = yield _model.default.findOne({
        shortHand: 'JClubs'
      });
      var threeClubs = yield _model.default.findOne({
        shortHand: '3Clubs'
      });
      var fourClubs = yield _model.default.findOne({
        shortHand: '4Clubs'
      });
      var fourDiamonds = yield _model.default.findOne({
        shortHand: '4Diamonds'
      });
      this.jackHearts = jackHearts;
      this.jackDiamonds = jackDiamonds;
      this.jackClubs = jackClubs;
      this.aceSpades = aceSpades;
      this.threeClubs = threeClubs;
      this.fourClubs = fourClubs;
      this.fourDiamonds = fourDiamonds;
      this.aceHearts = aceHearts;
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
        hand: [threeClubs, fourClubs],
        drinksReceived: [],
        drinksDrunk: 0
      };
      var player2 = {
        user: user2,
        joinedAt: new Date(),
        seatPosition: 1,
        hand: [fourDiamonds, jackDiamonds, jackClubs],
        drinksReceived: [{
          sentBy: user1
        }],
        drinksDrunk: 0
      };
      var player3 = {
        user: user3,
        joinedAt: new Date(),
        seatPosition: 2,
        hand: [aceSpades, aceHearts],
        drinksReceived: [],
        drinksDrunk: 0
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
          turns: [{
            user: this.user2,
            cardsPlayed: [jackHearts],
            wasPassed: false,
            wasSkipped: false,
            didCauseSkips: true,
            skipsRemaining: 0,
            endedRound: false
          }, {
            user: this.user3,
            cardsPlayed: [],
            wasPassed: false,
            wasSkipped: true,
            didCauseSkips: false,
            skipsRemaining: 0,
            endedRound: false
          }, {
            user: this.user1,
            cardsPlayed: [],
            wasPassed: true,
            wasSkipped: false,
            didCauseSkips: false,
            skipsRemaining: 0,
            endedRound: false
          }]
        }],
        players: [player1, player2, player3]
      };
      yield _model6.default.create(game);
    }));
    describe('validations', function () {
      it('player must have a drink to drink', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'drinkDrink prez game'
        });
        var message = 'Unable to drink any drinks. User has none to drink.';

        try {
          yield doc.drinkDrink(doc.currentPlayer);
        } catch (err) {
          expect(err.message).toBe(message);
        }
      }));
    });
    describe('successful', function () {
      it('players drinksDrunk count has increased', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'drinkDrink prez game'
        });

        try {
          yield doc.drinkDrink(this.user2);
        } catch (err) {}

        var player2 = doc.players.find(player => player.user.equals(this.user2._id));
        expect(player2.drinksDrunk).toBe(1);
      }));
    });
  });
});

exports.default = _default;