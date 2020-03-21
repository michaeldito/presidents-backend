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
  return describe('#getNextPlayer()', function () {
    before( /*#__PURE__*/_asyncToGenerator(function* () {
      var status = yield _model3.default.findByValue('NOT_STARTED');
      var config = yield _model2.default.findOne({
        name: 'Presidents'
      });
      var user1 = yield _model5.default.findByUsername('tommypastrami');
      var createdBy = user1;
      var name = 'get next player prez game';
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
      var player = {
        user: user1,
        seatPosition: 0,
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
        players: [player]
      };
      yield _model6.default.create(game);
    }));
    describe('successful', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        var user2 = yield _model5.default.findByUsername('jethro');
        var user3 = yield _model5.default.findByUsername('johnnyroastbeef');
        var user4 = yield _model5.default.findByUsername('bella');
        var user5 = yield _model5.default.findByUsername('tony');
        var user6 = yield _model5.default.findByUsername('tammy');
        var user7 = yield _model5.default.findByUsername('malory');
        var user8 = yield _model5.default.findByUsername('bobby');
        var users = [user2, user3, user4, user5, user6, user7, user8];
        var doc = yield _model6.default.findOne({
          name: 'get next player prez game'
        });

        try {
          for (var user of users) {
            yield doc.join(user);
          }

          yield doc.initialize();
        } catch (err) {
          console.log(err);
        }

        (0, _expect.default)(doc.players.length).toBe(8);
      }));
      it('when called 8 times it `wraps around` the players array (length 8)', /*#__PURE__*/_asyncToGenerator(function* () {
        var doc = yield _model6.default.findOne({
          name: 'get next player prez game'
        });
        var current = doc.currentPlayer.toString();
        var i = 8; // console.log(`start ${current}`)

        while (i > 0) {
          var next = yield doc.getNextPlayer();
          doc.currentPlayer = next; // console.log(`next ${doc.currentPlayer}`)

          yield doc.save();
          i--;
        } // console.log('done')


        var newCurrent = doc.currentPlayer.toString(); // console.log(`started with ${current}`)
        // console.log(`finished with ${newCurrent}`)

        (0, _expect.default)(current).toBe(newCurrent);
      }));
    });
  });
});

exports.default = _default;