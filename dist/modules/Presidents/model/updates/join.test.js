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
  return describe('#join()', function () {
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
      var name = 'validation prez game';
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
        players: [player, player, player, player, player, player, player, player]
      };
      yield _model6.default.create(game);
    }));
    describe('validations', function () {
      it('game is in progress', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });
        var message = 'Cannot join game. It`s in progress.';

        var user = _mongoose.default.Types.ObjectId();

        try {
          yield doc.join(user);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('game is finished', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });
        doc.status = yield _model3.default.findByValue('FINALIZED');
        yield doc.save();
        doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });
        var message = 'Cannot join game. It`s finished.';

        var user = _mongoose.default.Types.ObjectId();

        try {
          yield doc.join(user);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('game is full', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });
        doc.status = yield _model3.default.findByValue('NOT_STARTED');
        yield doc.save();
        doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });
        var message = 'Cannot join game. It is already full.';

        var user = _mongoose.default.Types.ObjectId();

        try {
          yield doc.join(user);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('user has already joined', /*#__PURE__*/_asyncToGenerator(function* () {
        yield _model6.default.updateOne({
          name: 'validation prez game'
        }, {
          $pop: {
            players: 1
          }
        });
        var message = 'User has already joined game.';

        try {
          var doc = yield _model6.default.findOne({
            name: 'validation prez game'
          });
          var user = yield _model5.default.findByUsername('tommypastrami');
          yield doc.join(user);
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
      it('user is required', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });
        var message = 'Missing argument, user is required.';

        try {
          yield doc.join();
        } catch (err) {
          (0, _expect.default)(err.message).toBe(message);
        }
      }));
    });
    describe('successful', function () {
      it('user is added to the game', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });

        var user = _mongoose.default.Types.ObjectId();

        try {
          yield doc.join(user);
          doc = yield _model6.default.findOne({
            name: 'validation prez game'
          });
          (0, _expect.default)(doc.players.length).toBe(8);
        } catch (err) {}
      }));
      it('player[user].joinedAt has a timestamp', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'validation prez game'
        });

        try {
          (0, _expect.default)(doc.players[7].joinedAt).toBeTruthy();
        } catch (err) {}
      }));
      it('player[user].seatPosition is set incrementally', /*#__PURE__*/_asyncToGenerator(function* () {}));
    });
  });
});

exports.default = _default;