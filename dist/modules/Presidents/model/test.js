"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _test = require("../../../modules/Card/model/test");

var _test2 = require("../../../modules/CardRank/model/test");

var _test3 = require("../../../modules/GameConfiguration/model/test");

var _test4 = require("../../../modules/GameStatus/model/test");

var _test5 = require("../../../modules/PoliticalRank/model/test");

var _test6 = require("../../../modules/Suit/model/test");

var _test7 = require("../../../modules/User/model/test");

var _model = _interopRequireDefault(require("../../Card/model"));

var _model2 = _interopRequireDefault(require("../../GameConfiguration/model"));

var _model3 = _interopRequireDefault(require("../../GameStatus/model"));

var _model4 = _interopRequireDefault(require("../../PoliticalRank/model"));

var _model5 = _interopRequireDefault(require("../../User/model"));

var _ = _interopRequireDefault(require("."));

var _areCardsBetter = _interopRequireDefault(require("./conditionals/areCardsBetter.test"));

var _areCardsValid = _interopRequireDefault(require("./conditionals/areCardsValid.test"));

var _didCurrentPlayersLastTurnEndTheRound = _interopRequireDefault(require("./conditionals/didCurrentPlayersLastTurnEndTheRound.test"));

var _shouldProcessTurn = _interopRequireDefault(require("./conditionals/shouldProcessTurn.test"));

var _getNextPlayer = _interopRequireDefault(require("./queries/getNextPlayer.test"));

var _drinkDrink = _interopRequireDefault(require("./updates/drinkDrink.test"));

var _giveDrink = _interopRequireDefault(require("./updates/giveDrink.test"));

var _initialize = _interopRequireDefault(require("./updates/initialize.test"));

var _initializeNextRound = _interopRequireDefault(require("./updates/initializeNextRound.test"));

var _join = _interopRequireDefault(require("./updates/join.test"));

var _processTurn = _interopRequireDefault(require("./updates/processTurn.test"));

var _calculateSkips = _interopRequireDefault(require("./utils/calculateSkips.test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({});
    if (count === 1) return Promise.resolve();
    var status = yield _model3.default.findByValue('NOT_STARTED');
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
    var name = 'test prez game';
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
      players: [{
        user,
        joinedAt: new Date(),
        seatPosition: 1,
        hand,
        politicalRank,
        nextGameRank,
        drinksDrunk,
        drinksReceived,
        drinksSent
      }]
    };
    yield _.default.create(game);
  });

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

exports.init = init;

var drop = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    yield _.default.deleteMany({});
  });

  return function drop() {
    return _ref2.apply(this, arguments);
  };
}();

exports.drop = drop;

var test = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* () {
    return describe('Presidents', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        this.timeout(20000);
        yield _db.default.connect();
        yield Promise.all([(0, _test2.init)(), (0, _test6.init)()]);
        yield Promise.all([(0, _test.init)(), (0, _test7.init)(), (0, _test4.init)(), (0, _test5.init)()]);
        yield (0, _test3.init)();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield Promise.all([(0, _test2.drop)(), (0, _test6.drop)(), (0, _test.drop)(), (0, _test7.drop)(), (0, _test4.drop)(), (0, _test3.drop)(), (0, _test5.drop)()]);
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it creates 1 presidents game document', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({}); // docs[0].config.deck=[]
          // console.log(JSON.stringify(docs[0], null, 2))

          (0, _expect.default)(docs.length).toBe(1);
        }));
        describe('validations', function () {
          before( /*#__PURE__*/_asyncToGenerator(function* () {
            // presidents game with all required feilds
            this.game = {
              rules: {
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
              },
              createdBy: _mongoose.default.Types.ObjectId(),
              name: 'validation game',
              status: _mongoose.default.Types.ObjectId(),
              config: _mongoose.default.Types.ObjectId(),
              currentPlayer: _mongoose.default.Types.ObjectId(),
              rounds: [{
                turns: [{
                  user: _mongoose.default.Types.ObjectId(),
                  wasPassed: false,
                  wasSkipped: false,
                  didCauseSkips: false,
                  skipsRemaining: 0,
                  endedRound: false
                }]
              }],
              players: [{
                user: _mongoose.default.Types.ObjectId(),
                seatPosition: 1,
                drinksReceived: [{
                  sentBy: _mongoose.default.Types.ObjectId()
                }],
                drinksSent: [{
                  sentTo: _mongoose.default.Types.ObjectId()
                }]
              }]
            };
            this.rulesCopy = {
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
          }));
          describe('rules', function () {
            it('rules are required', /*#__PURE__*/_asyncToGenerator(function* () {
              var _this$game = this.game,
                  {
                rules
              } = _this$game,
                  rest = _objectWithoutProperties(_this$game, ["rules"]);

              var g1 = _objectSpread({}, rest);

              var instance = new _.default(g1);
              var message = 'A value for rules is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors.rules.message).toBe(message);
            }));
            it('rules.doubleSkips is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.doubleSkips;
              var instance = new _.default(this.game);
              var message = 'A value for rules.doubleSkips is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.doubleSkips'].message).toBe(message);
            }));
            it('rules.scumStarts is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.scumStarts;
              var instance = new _.default(this.game);
              var message = 'A value for rules.scumStarts is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.scumStarts'].message).toBe(message);
            }));
            it('rules.scumHandsTwo is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.scumHandsTwo;
              var instance = new _.default(this.game);
              var message = 'A value for rules.scumHandsTwo is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.scumHandsTwo'].message).toBe(message);
            }));
            it('rules.oneEyedJacksAndKingOfHearts is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.oneEyedJacksAndKingOfHearts;
              var instance = new _.default(this.game);
              var message = 'A value for rules.oneEyedJacksAndKingOfHearts is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.oneEyedJacksAndKingOfHearts'].message).toBe(message);
            }));
            it('rules.reversePresidentScumTrade is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.reversePresidentScumTrade;
              var instance = new _.default(this.game);
              var message = 'A value for rules.reversePresidentScumTrade is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.reversePresidentScumTrade'].message).toBe(message);
            }));
            it('rules.presidentDeals is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.presidentDeals;
              var instance = new _.default(this.game);
              var message = 'A value for rules.presidentDeals is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.presidentDeals'].message).toBe(message);
            }));
            it('rules.goLow is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.goLow;
              var instance = new _.default(this.game);
              var message = 'A value for rules.goLow is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.goLow'].message).toBe(message);
            }));
            it('rules.equalNumber is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.equalNumber;
              var instance = new _.default(this.game);
              var message = 'A value for rules.equalNumber is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.equalNumber'].message).toBe(message);
            }));
            it('rules.noEndOnBomb is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.noEndOnBomb;
              var instance = new _.default(this.game);
              var message = 'A value for rules.noEndOnBomb is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.noEndOnBomb'].message).toBe(message);
            }));
            it('rules.tripleSixes is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.tripleSixes;
              var instance = new _.default(this.game);
              var message = 'A value for rules.tripleSixes is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.tripleSixes'].message).toBe(message);
            }));
            it('rules.passOut is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.passOut;
              var instance = new _.default(this.game);
              var message = 'A value for rules.passOut is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.passOut'].message).toBe(message);
            }));
            it('rules.fourInARow is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.fourInARow;
              var instance = new _.default(this.game);
              var message = 'A value for rules.fourInARow is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.fourInARow'].message).toBe(message);
            }));
            it('rules.larryPresidents is required', /*#__PURE__*/_asyncToGenerator(function* () {
              delete this.game.rules.larryPresidents;
              var instance = new _.default(this.game);
              var message = 'A value for rules.larryPresidents is required to create a Presidents game.';
              var error = instance.validateSync();
              (0, _expect.default)(error.errors['rules.larryPresidents'].message).toBe(message);
            }));
          });
          describe('rounds', function () {
            describe('turns', function () {
              it('turns.user is required', /*#__PURE__*/_asyncToGenerator(function* () {
                var turn = {
                  wasPassed: false,
                  wasSkipped: false,
                  didCauseSkips: false,
                  skipsRemaining: 0,
                  endedRound: false
                };
                var doc = yield _.default.findOne({});
                doc.rounds[0].turns.push(turn);
                doc.save(error => {
                  var message = 'A value for rounds[i].turns[i].user is required.';
                  (0, _expect.default)(error.errors['rounds.0.turns.1.user'].message).toBe(message);
                });
              }));
              it('turns.wasPassed is required', /*#__PURE__*/_asyncToGenerator(function* () {
                var turn = {
                  user: _mongoose.default.Types.ObjectId(),
                  wasSkipped: false,
                  didCauseSkips: false,
                  skipsRemaining: 0,
                  endedRound: false
                };
                var doc = yield _.default.findOne({});
                doc.rounds[0].turns.push(turn);
                doc.save(error => {
                  var message = 'A value for rounds[i].turns[i].wasPassed is required.';
                  (0, _expect.default)(error.errors['rounds.0.turns.1.wasPassed'].message).toBe(message);
                });
              }));
              it('turns.wasSkipped is required', /*#__PURE__*/_asyncToGenerator(function* () {
                var turn = {
                  user: _mongoose.default.Types.ObjectId(),
                  wasPassed: false,
                  didCauseSkips: false,
                  skipsRemaining: 0,
                  endedRound: false
                };
                var doc = yield _.default.findOne({});
                doc.rounds[0].turns.push(turn);
                doc.save(error => {
                  var message = 'A value for rounds[i].turns[i].wasSkipped is required.';
                  (0, _expect.default)(error.errors['rounds.0.turns.1.wasSkipped'].message).toBe(message);
                });
              }));
              it('turns.didCauseSkips is required', /*#__PURE__*/_asyncToGenerator(function* () {
                var turn = {
                  user: _mongoose.default.Types.ObjectId(),
                  wasPassed: false,
                  wasSkipped: false,
                  skipsRemaining: 0,
                  endedRound: false
                };
                var doc = yield _.default.findOne({});
                doc.rounds[0].turns.push(turn);
                doc.save(error => {
                  var message = 'A value for rounds[i].turns[i].didCauseSkips is required.';
                  (0, _expect.default)(error.errors['rounds.0.turns.1.didCauseSkips'].message).toBe(message);
                });
              }));
              it('turns.skipsRemaining is required', /*#__PURE__*/_asyncToGenerator(function* () {
                var turn = {
                  user: _mongoose.default.Types.ObjectId(),
                  wasPassed: false,
                  wasSkipped: false,
                  didCauseSkips: false,
                  endedRound: false
                };
                var doc = yield _.default.findOne({});
                doc.rounds[0].turns.push(turn);
                doc.save(error => {
                  var message = 'A value for rounds[i].turns[i].skipsRemaining is required.';
                  (0, _expect.default)(error.errors['rounds.0.turns.1.skipsRemaining'].message).toBe(message);
                });
              }));
              it('turns.endedRound is required', /*#__PURE__*/_asyncToGenerator(function* () {
                var turn = {
                  user: _mongoose.default.Types.ObjectId(),
                  wasPassed: false,
                  wasSkipped: false,
                  didCauseSkips: false,
                  skipsRemaining: 0
                };
                var doc = yield _.default.findOne({});
                doc.rounds[0].turns.push(turn);
                doc.save(error => {
                  var message = 'A value for rounds[i].turns[i].endedRound is required.';
                  (0, _expect.default)(error.errors['rounds.0.turns.1.endedRound'].message).toBe(message);
                });
              }));
            });
          });
          describe('players', function () {
            it('players.user is required', /*#__PURE__*/_asyncToGenerator(function* () {
              var player = {
                seatPosition: 0
              };
              var doc = yield _.default.findOne({});
              doc.players.push(player);
              doc.save(error => {
                var message = 'A value for players[i].user is required.';
                (0, _expect.default)(error.errors['players.1.user'].message).toBe(message);
              });
            }));
            it('players.seatPosition is required', /*#__PURE__*/_asyncToGenerator(function* () {
              var player = {
                user: _mongoose.default.Types.ObjectId()
              };
              var doc = yield _.default.findOne({});
              doc.players.push(player);
              doc.save(error => {
                var message = 'A value for players[i].seatPosition is required.';
                (0, _expect.default)(error.errors['players.1.seatPosition'].message).toBe(message);
              });
            }));
            it('drinksReceived.sentBy is required', /*#__PURE__*/_asyncToGenerator(function* () {
              var doc = yield _.default.findOne({});
              doc.players[0].drinksReceived.push({});
              doc.save(error => {
                var message = 'A value for players[i].drinksReceived.sentBy is required.';
                (0, _expect.default)(error.errors['players.0.drinksReceived.1.sentBy'].message).toBe(message);
              });
            }));
            it('drinksSent.sentTo is required', /*#__PURE__*/_asyncToGenerator(function* () {
              var doc = yield _.default.findOne({});
              doc.players[0].drinksSent.push({});
              doc.save(error => {
                var message = 'A value for players[i].drinksSent.sentTo is required.';
                (0, _expect.default)(error.errors['players.0.drinksSent.1.sentTo'].message).toBe(message);
              });
            }));
          });
        });
      });
      (0, _join.default)();
      (0, _initialize.default)();
      (0, _initializeNextRound.default)();
      (0, _getNextPlayer.default)();
      (0, _areCardsBetter.default)();
      (0, _areCardsValid.default)();
      (0, _shouldProcessTurn.default)();
      (0, _calculateSkips.default)();
      (0, _processTurn.default)();
      (0, _didCurrentPlayersLastTurnEndTheRound.default)();
      (0, _drinkDrink.default)();
      (0, _giveDrink.default)();
      describe('#drop()', function () {
        it('verify drop() deletes all presidents game documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield drop();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(0);
        }));
      });
    });
  });

  return function test() {
    return _ref3.apply(this, arguments);
  };
}();

exports.test = test;
var Test = {
  init,
  drop,
  test
};
var _default = Test;
exports.default = _default;