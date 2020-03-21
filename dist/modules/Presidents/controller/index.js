"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.rematch = exports.drinkDrink = exports.giveDrink = exports.processTurn = exports.initialize = exports.join = exports.create = exports.details = exports.getOne = exports.getAll = void 0;

var _mongoose = require("mongoose");

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _Transaction = _interopRequireDefault(require("../../../utils/Transaction"));

var _model = _interopRequireDefault(require("../../Card/model"));

var _model2 = _interopRequireDefault(require("../../GameConfiguration/model"));

var _model3 = _interopRequireDefault(require("../../GameStatus/model"));

var _model4 = _interopRequireDefault(require("../../User/model"));

var _model5 = _interopRequireDefault(require("../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getAll = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@GET('/presidents/getAll')]");

    try {
      var docs = yield _model5.default.find({});
      (0, _logger.default)("[koa@GET('/presidents/getAll')] found ".concat(docs.length, " docs"));
      var body = {
        total: docs.length,
        data: docs
      };
      ctx.body = body;
      ctx.status = 200;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function getAll(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getAll = getAll;

var getOne = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@GET('/presidents/getOne')]");
    var {
      id
    } = ctx.params;

    try {
      var doc = yield _model5.default.findById(id);
      (0, _logger.default)("[koa@GET('/presidents/getOne')] found: ".concat(!!doc));
      var body = doc.toObject();
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function getOne(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getOne = getOne;

var details = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@GET('/presidents/details')]");

    try {
      var docs = yield _model5.default.find({});
      docs = docs.map(doc => {
        var {
          id,
          name,
          createdAt,
          startedAt,
          finishedAt,
          status,
          createdBy,
          winner
        } = doc.toJSON();
        var type = doc.config.name;

        if (!winner) {
          winner = '-';
        }

        return {
          id,
          name,
          type,
          createdAt,
          startedAt,
          finishedAt,
          status,
          createdBy,
          winner
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      (0, _logger.default)("[koa@GET('/presidents/details')] found ".concat(docs.length, " docs"));
      var body = docs;
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function details(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.details = details;

var create = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@POST('/presidents/create')]");
    (0, _logger.default)(ctx.request.body);
    var {
      name,
      createdBy,
      gameType
    } = ctx.request.body;
    (0, _logger.default)({
      name,
      createdBy,
      gameType
    });
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

    try {
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        (0, _logger.default)("[koa@POST('/presidents')] finding config");
        var config = yield _model2.default.findByName(gameType);
        config = config._id;
        (0, _logger.default)("[koa@POST('/presidents')] finding not started status");
        var status = yield _model3.default.findByValue('NOT_STARTED');
        status = status._id;
        (0, _logger.default)("[koa@POST('/presidents')] finding user");
        var user = yield _model4.default.findById(createdBy);
        (0, _logger.default)("user: ".concat(user));
        user = user._id;
        var game = {
          name,
          status,
          createdBy: user,
          rules,
          config
        };
        (0, _logger.default)("[koa@POST('/presidents')] creating the game");
        (0, _logger.default)("[koa@POST('/presidents')] ".concat(game));
        doc = yield _model5.default.create(game);
        (0, _logger.default)("[koa@POST('/presidents')] adding creator to the game");
        doc = yield doc.join(user);
        (0, _logger.default)("[koa@POST('/presidents')] adding game to creators gamesPlayed");
        user = yield _model4.default.findOne(user);
        user.gamesPlayed.push(doc._id);
        yield user.save();
      }));
      doc = yield _model5.default.findById(doc._id);
      var body = doc.toObject();
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function create(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.create = create;

var join = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('/presidents/join')]");
    var {
      id
    } = ctx.params;
    var {
      userId
    } = ctx.request.body;
    (0, _logger.default)("[koa@PUT('/presidents/join')] user: ".concat(userId));

    try {
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        (0, _logger.default)("[koa@POST('/presidents/join')] adding user to game");
        var user = yield _model4.default.findById(userId);
        (0, _logger.default)("[koa@PUT('/presidents/join')] ".concat(user));
        doc = yield _model5.default.findById(id);
        doc = yield doc.join(user);
        (0, _logger.default)("[koa@POST('/presidents/join')] adding game to creators gamesPlayed");
        user.gamesPlayed.push(doc._id);
        user = yield user.save();
      }));
      doc = yield _model5.default.findById(doc._id);
      var body = doc.toObject();
      ctx.request.app.io.emit('game join', {
        game: body
      });
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function join(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

exports.join = join;

var initialize = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('/presidents/initialize')]");
    var {
      id
    } = ctx.params;

    try {
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        doc = yield _model5.default.findById(id);
        yield doc.initialize();
        yield doc.initializeNextRound();
      }));
      doc = yield _model5.default.findById(doc._id);
      var body = doc.toObject();
      ctx.request.app.io.emit('game refresh', {
        game: body
      });
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function initialize(_x6) {
    return _ref8.apply(this, arguments);
  };
}();

exports.initialize = initialize;

var processTurn = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('/presidents/processTurn')]");
    var {
      id
    } = ctx.params;
    var {
      user,
      cardsPlayed,
      wasPassed
    } = ctx.request.body;
    var turn;
    (0, _logger.default)("[koa@PUT('/presidents/processTurn')] cardsPlayed: ".concat(JSON.stringify(cardsPlayed)));

    try {
      var body;
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        doc = yield _model5.default.findById(id);
        cardsPlayed = yield _model.default.findManyByIds(cardsPlayed);
        var {
          turnToBeat
        } = doc;
        var turnToBeatCards = []; // we don't have tturn to beat when we start -> undefined
        // when the round is ended we clear turn to beat -> null
        // this verifies that we do have cards to lookup from the last turn to beat

        if (turnToBeat !== undefined && turnToBeat !== null) {
          turnToBeatCards = yield _model.default.findManyByIds(turnToBeat.cardsPlayed);
        }

        if (doc.status.value !== 'IN_PROGRESS') {
          ctx.throw(400, 'cannot process turn - game is not in progress');
        } // user is passing


        if (wasPassed && user._id === doc.currentPlayer.toString()) {
          (0, _logger.default)("[koa@PUT('presidents/processTurn')] turn was a pass");

          if (cardsPlayed.length > 0) {
            ctx.throw(400, 'cannot pass and submit cards');
          }

          turn = {
            user: user._id,
            cardsPlayed,
            wasPassed,
            wasSkipped: false,
            didCauseSkips: false,
            skipsRemaining: 0,
            endedRound: false
          };
          doc = yield doc.processTurn(turn);
          body = doc.toObject();
        } else {
          // user is not passing
          (0, _logger.default)("[koa@PUT('presidents/processTurn')] turn is not a pass");
          turn = {
            user: user._id,
            cardsPlayed,
            wasPassed
          };
          (0, _logger.default)("[koa@PUT('presidents/processTurn')] should we process this turn?");
          var shouldProcessTurn = yield doc.shouldProcessTurn(turn); // is the turn valid and better, or a special card?

          if (shouldProcessTurn) {
            (0, _logger.default)("[koa@PUT('presidents/processTurn')] we need to process this turn");
            (0, _logger.default)("[koa@PUT('presidents/processTurn')] will it cause any skips?");
            turn.skipsRemaining = _model5.default.calculateSkips(turnToBeatCards, cardsPlayed);
            turn.didCauseSkips = turn.skipsRemaining > 0;
            turn.wasSkipped = false;
            turn.endedRound = false;
            doc = yield doc.processTurn(turn); // process any skips

            if (turn.didCauseSkips) {
              (0, _logger.default)("[koa@PUT('presidents/processTurn')] we also need to process ".concat(turn.skipsRemaining, " skips"));

              while (turn.skipsRemaining) {
                turn.skipsRemaining--;
                var skipTurn = {
                  user: doc.currentPlayer,
                  cardsPlayed: [],
                  wasPassed: false,
                  wasSkipped: true,
                  didCauseSkips: false,
                  skipsRemaining: turn.skipsRemaining,
                  endedRound: false
                };
                (0, _logger.default)("[koa@PUT('presidents/processTurn')] time to process a skip");
                doc = yield doc.processTurn(skipTurn);
              }
            }
          }
        }

        if (doc.status.value === 'IN_PROGRESS') {
          (0, _logger.default)("[koa@PUT('presidents/processTurn')] did the next player's last turn end the round?");
          var didCurrentPlayersLastTurnEndTheRound = doc.didCurrentPlayersLastTurnEndTheRound();
          (0, _logger.default)("[koa@PUT('presidents/processTurn')] didCurrentPlayersLastTurnEndTheRound ".concat(didCurrentPlayersLastTurnEndTheRound));

          if (didCurrentPlayersLastTurnEndTheRound) {
            (0, _logger.default)("[koa@PUT('presidents/processTurn')] let's initialize the next round & reset the hand to beat");
            doc = yield doc.initializeNextRound();
          }
        }
      }));
      doc = yield _model5.default.findById(doc._id);
      body = doc.toObject();
      ctx.request.app.io.emit('game refresh', {
        game: body
      });
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function processTurn(_x7) {
    return _ref10.apply(this, arguments);
  };
}();

exports.processTurn = processTurn;

var giveDrink = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('/presidents/giveDrink')]");
    var {
      id
    } = ctx.params;
    var {
      toUser,
      fromUser
    } = ctx.request.body;

    try {
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        doc = yield _model5.default.findById(id);
        fromUser = yield _model4.default.findById(fromUser);
        toUser = yield _model4.default.findById(toUser);
        doc = yield doc.giveDrink(fromUser, toUser);
      }));
      doc = yield _model5.default.findById(doc._id);
      var body = doc.toObject();
      ctx.request.app.io.emit('drink given', {
        game: body
      });
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function giveDrink(_x8) {
    return _ref12.apply(this, arguments);
  };
}();

exports.giveDrink = giveDrink;

var drinkDrink = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('/presidents/drinkDrink')]");
    var {
      id
    } = ctx.params;
    var {
      userId
    } = ctx.request.body;

    try {
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        doc = yield _model5.default.findById(id);
        var user = yield _model4.default.findById(userId);
        doc = yield doc.drinkDrink(user);
        doc = yield _model5.default.findById(doc._id);
      }));
      var body = doc.toObject();
      ctx.request.app.io.emit('drink drunk', {
        game: body
      });
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function drinkDrink(_x9) {
    return _ref14.apply(this, arguments);
  };
}();

exports.drinkDrink = drinkDrink;

var rematch = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@POST('/presidents/rematch')]");
    var {
      id
    } = ctx.params;

    try {
      var doc;
      yield (0, _Transaction.default)( /*#__PURE__*/_asyncToGenerator(function* () {
        doc = yield _model5.default.findById(id);
        (0, _logger.default)("[koa@POST('/presidents/rematch')] sorting players by seat position");
        var players = doc.players.sort((a, b) => a.seatPosition < b.seatPosition ? 1 : -1);
        var usersToAdd = [];
        (0, _logger.default)("[koa@POST('/presidents/rematch')] grabbing their userId and nextGameRanks");

        for (var player of players) {
          var {
            user,
            nextGameRank
          } = player;
          usersToAdd.push({
            _id: user._id,
            nextGameRank
          });
        }

        var {
          rules,
          createdBy,
          config
        } = doc;
        var name = "".concat(doc.name, "-rematch-").concat(_mongoose.Types.ObjectId());
        var status = yield _model3.default.findByValue('NOT_STARTED');
        (0, _logger.default)("[koa@POST('/presidents/rematch')] creating a rematch game with same configs");
        doc = yield _model5.default.create({
          name,
          status,
          rules,
          createdBy,
          config
        });

        for (var _user of usersToAdd) {
          (0, _logger.default)("[koa@POST('/presidents/rematch')] adding user ".concat(_user._id));
          doc = yield doc.join(_user);
          var userDoc = yield _model4.default.findById(_user._id);
          userDoc.gamesPlayed.push(doc._id);
          yield userDoc.save();
        }

        (0, _logger.default)("[koa@POST('/presidents/rematch')] initializing the game");
        doc = yield doc.initialize();
        doc = yield doc.initializeNextRound();
      }));
      doc = yield _model5.default.findById(doc._id);
      var body = doc.toObject();
      ctx.request.app.io.emit('rematch started', {
        game: body
      });
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function rematch(_x10) {
    return _ref16.apply(this, arguments);
  };
}();

exports.rematch = rematch;
var Controller = {
  getAll,
  getOne,
  details,
  create,
  initialize,
  processTurn,
  giveDrink,
  drinkDrink,
  rematch
};
var _default = Controller;
exports.default = _default;