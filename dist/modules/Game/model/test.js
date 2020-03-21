"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _test = require("../../Card/model/test");

var _test2 = require("../../CardRank/model/test");

var _model = _interopRequireDefault(require("../../GameConfiguration/model"));

var _test3 = require("../../GameConfiguration/model/test");

var _model2 = _interopRequireDefault(require("../../GameStatus/model"));

var _test4 = require("../../GameStatus/model/test");

var _test5 = require("../../Suit/model/test");

var _model3 = _interopRequireDefault(require("../../User/model"));

var _test6 = require("../../User/model/test");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({});
    if (count === 1) return Promise.resolve();
    var status = yield _model2.default.findByValue('NOT_STARTED');
    var config = yield _model.default.findOne({
      name: 'test-game'
    });
    var currentPlayer = yield _model3.default.findByUsername('tommypastrami');
    var createdBy = currentPlayer;
    var name = 'test game';
    var game = {
      name,
      createdBy,
      currentPlayer,
      status,
      config,
      currentPlayer
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
    return describe('Game', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        this.timeout(20000);
        yield _db.default.connect();
        yield (0, _test2.init)();
        yield (0, _test5.init)();
        yield (0, _test.init)();
        yield Promise.all([(0, _test6.init)(), (0, _test4.init)(), (0, _test3.init)()]);
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield Promise.all([(0, _test.drop)(), (0, _test5.drop)(), (0, _test2.drop)(), (0, _test6.drop)(), (0, _test4.drop)(), (0, _test3.drop)()]);
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it creates 1 game document', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({}); // console.log(docs)

          (0, _expect.default)(docs.length).toBe(1);
        }));
        describe('validations', function () {
          before( /*#__PURE__*/_asyncToGenerator(function* () {
            var status = yield _model2.default.findByValue('NOT_STARTED');
            var config = yield _model.default.findOne({
              name: 'test-game'
            });
            var currentPlayer = yield _model3.default.findByUsername('tommypastrami');
            var createdBy = currentPlayer;
            var name = 'test game init validations';
            this.game = {
              name,
              createdBy,
              currentPlayer,
              status,
              config,
              currentPlayer
            };
          }));
          it('name is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var _this$game = this.game,
                {
              name
            } = _this$game,
                rest = _objectWithoutProperties(_this$game, ["name"]);

            var g1 = rest;
            var instance = new _.default(g1);
            var error = instance.validateSync();
            var message = 'A name is required to create a game.';
            (0, _expect.default)(error.errors.name.message).toBe(message);
          }));
          it('name must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var _this$game2 = this.game,
                {
              name
            } = _this$game2,
                rest = _objectWithoutProperties(_this$game2, ["name"]);

            var g1 = rest;
            g1.name = 'test game'; // used above in init

            var instance = new _.default(g1);
            var message = 'Error, expected `name` to be unique. Value: `test game`';
            instance.save(error => {
              (0, _expect.default)(error.errors.name.message).toBe(message);
            });
          }));
          it('status is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var _this$game3 = this.game,
                {
              status
            } = _this$game3,
                rest = _objectWithoutProperties(_this$game3, ["status"]);

            var g1 = rest;
            var instance = new _.default(g1);
            var error = instance.validateSync();
            var message = 'A status is required to create a game.';
            (0, _expect.default)(error.errors.status.message).toBe(message);
          }));
          it('config is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var _this$game4 = this.game,
                {
              config
            } = _this$game4,
                rest = _objectWithoutProperties(_this$game4, ["config"]);

            var g1 = rest;
            var instance = new _.default(g1);
            var error = instance.validateSync();
            var message = 'A config is required to create a game.';
            (0, _expect.default)(error.errors.config.message).toBe(message);
          }));
          it('createdBy is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var _this$game5 = this.game,
                {
              createdBy
            } = _this$game5,
                rest = _objectWithoutProperties(_this$game5, ["createdBy"]);

            var g1 = rest;
            var instance = new _.default(g1);
            var error = instance.validateSync();
            var message = 'A createdBy is required to create a game.';
            (0, _expect.default)(error.errors.createdBy.message).toBe(message);
          }));
        });
      });
      describe('#drop()', function () {
        it('verify it deletes all game documents', /*#__PURE__*/_asyncToGenerator(function* () {
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