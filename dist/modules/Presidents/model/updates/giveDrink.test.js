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
  return describe('#giveDrink()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      var status = yield _model3.default.findByValue('IN_PROGRESS');
      var config = yield _model2.default.findOne({
        name: 'Presidents'
      });
      this.user1 = yield _model5.default.findByUsername('tommypastrami');
      this.user2 = yield _model5.default.findByUsername('bella');
      var user1 = this.user1._id;
      var user2 = this.user2._id;
      var currentPlayer = user2;
      var createdBy = currentPlayer;
      var name = 'giveDrink prez game';
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
        hand: [],
        drinksReceived: [],
        drinksDrunk: 0,
        drinksSent: [],
        politicalRank: yield _model4.default.findByValue(1)
      };
      var player2 = {
        user: user2,
        joinedAt: new Date(),
        seatPosition: 1,
        hand: [],
        drinksReceived: [],
        drinksSent: [],
        drinksDrunk: 0,
        politicalRank: yield _model4.default.findByValue(2)
      };
      this.player1 = player1;
      this.player2 = player2;
      var game = {
        createdBy,
        name,
        status,
        config,
        rules,
        currentPlayer,
        handToBeat: [],
        rounds: [{
          turns: []
        }],
        players: [player1, player2]
      };
      yield _model6.default.create(game);
      var game2 = {
        createdBy,
        name: 'giveDrink2 prez game',
        status,
        config,
        rules,
        currentPlayer,
        handToBeat: [],
        rounds: [{
          turns: []
        }],
        players: [player1, player2]
      };
      game2.name = 'giveDrink2 prez game';
      delete game2.players[0].politicalRank;
      delete game2.players[1].politicalRank;
      yield _model6.default.create(game2);
    }));
    describe('validations', function () {
      it('fromPlayer must out rank toPlayer', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'giveDrink prez game'
        });
        var message = 'fromPlayer must out rank toPlayer in order to give a drink';
        var fromUser = this.user2._id;
        var toUser = this.user1._id;

        try {
          yield doc.giveDrink(fromUser, toUser);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('must wait til players have ranks to give a drink', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'giveDrink2 prez game'
        });
        var message = 'you must wait til all players have ranks to give drinks out';
        var fromUser = this.user2._id;
        var toUser = this.user1._id;

        try {
          yield doc.giveDrink(fromUser, toUser);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('toPlayer has a drink from fromPlayer to drink already', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'giveDrink2 prez game'
        });
        doc.players[0].politicalRank = yield _model4.default.findByValue(1);
        doc.players[1].politicalRank = yield _model4.default.findByValue(2);
        yield doc.save();
        var fromUser = this.user1._id;
        var toUser = this.user2._id;
        var message = "toPlayer already has a drink to drink from fromPlayer. you can't give another";

        try {
          yield doc.giveDrink(fromUser, toUser);
          yield doc.giveDrink(fromUser, toUser);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
    });
    describe('successful', function () {
      it('toPlayer has a drinkReceived & fromPlayer has a drinkSent', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'giveDrink prez game'
        });
        var fromUser = this.user1._id;
        var toUser = this.user2._id;

        try {
          yield doc.giveDrink(fromUser, toUser);
        } catch (err) {
          console.log(err);
        }

        var toPlayer = doc.players.find(player => player.user.equals(toUser));
        var fromPlayer = doc.players.find(player => player.user.equals(fromUser));
        (0, _expect.default)(toPlayer.drinksReceived.length).toBe(1);
        (0, _expect.default)(fromPlayer.drinksSent.length).toBe(1);
      }));
    });
  });
});

exports.default = _default;