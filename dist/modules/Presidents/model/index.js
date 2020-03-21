"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseAutopopulate = _interopRequireDefault(require("mongoose-autopopulate"));

var _model = _interopRequireDefault(require("../../Game/model"));

var _areCardsBetter = _interopRequireDefault(require("./conditionals/areCardsBetter"));

var _areCardsValid = _interopRequireDefault(require("./conditionals/areCardsValid"));

var _didCurrentPlayersLastTurnEndTheRound = _interopRequireDefault(require("./conditionals/didCurrentPlayersLastTurnEndTheRound"));

var _shouldProcessTurn = _interopRequireDefault(require("./conditionals/shouldProcessTurn"));

var _getNextPlayer = _interopRequireDefault(require("./queries/getNextPlayer"));

var _Player = _interopRequireDefault(require("./schemas/Player"));

var _Round = _interopRequireDefault(require("./schemas/Round"));

var _Rules = _interopRequireDefault(require("./schemas/Rules"));

var _Turn = _interopRequireDefault(require("./schemas/Turn"));

var _drinkDrink = _interopRequireDefault(require("./updates/drinkDrink"));

var _giveDrink = _interopRequireDefault(require("./updates/giveDrink"));

var _initialize = _interopRequireDefault(require("./updates/initialize"));

var _initializeNextRound = _interopRequireDefault(require("./updates/initializeNextRound"));

var _join = _interopRequireDefault(require("./updates/join"));

var _processTurn = _interopRequireDefault(require("./updates/processTurn"));

var _calculateSkips = _interopRequireDefault(require("./utils/calculateSkips"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// conditionals
// queries
// updates
// utils
var PresidentsSchema = new _mongoose.default.Schema({
  winner: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User'
  },
  turnToBeat: {
    type: _Turn.default
  },
  rules: {
    type: _Rules.default,
    required: [true, 'A value for rules is required to create a Presidents game.']
  },
  rounds: {
    type: [_Round.default],
    required: true
  },
  players: {
    type: [_Player.default],
    required: true
  },
  drinks: []
}); // conditionals

PresidentsSchema.statics.areCardsValid = _areCardsValid.default;
PresidentsSchema.statics.areCardsBetter = _areCardsBetter.default;
PresidentsSchema.methods.shouldProcessTurn = _shouldProcessTurn.default;
PresidentsSchema.methods.didCurrentPlayersLastTurnEndTheRound = _didCurrentPlayersLastTurnEndTheRound.default; // queries

PresidentsSchema.methods.getNextPlayer = _getNextPlayer.default; // updates

PresidentsSchema.methods.join = _join.default;
PresidentsSchema.methods.initialize = _initialize.default;
PresidentsSchema.methods.initializeNextRound = _initializeNextRound.default;
PresidentsSchema.methods.processTurn = _processTurn.default;
PresidentsSchema.methods.drinkDrink = _drinkDrink.default;
PresidentsSchema.methods.giveDrink = _giveDrink.default; // utils

PresidentsSchema.statics.calculateSkips = _calculateSkips.default;

PresidentsSchema.statics.shuffle = arr => {
  var a = [...arr];

  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

var create2DArray = rows => {
  var A = [];

  for (var i = 0; i < rows; i++) {
    A[i] = [];
  }

  return A;
};

PresidentsSchema.statics.deal = (numPlayers, shuffled) => {
  var dealtCards = create2DArray(numPlayers);
  var i = 0;

  while (shuffled.length > 0) {
    dealtCards[i].push(shuffled.pop());
    i = (i + 1) % numPlayers;
  }

  return dealtCards;
};

PresidentsSchema.statics.sortCards = cards => {
  return cards.sort((a, b) => a.cardRank.value > b.cardRank.value ? 1 : -1);
};

PresidentsSchema.statics.find3Clubs = allPlayerHands => {
  var p = 0;

  for (var player of allPlayerHands) {
    for (var card of player) {
      if (card.shortHand === '3Clubs') {
        return p;
      }
    }

    p += 1;
  } // should never reach here


  throw new Error('3 of Clubs was not in the deck.');
};

PresidentsSchema.statics.areCardsOfSameRank = cards => {
  var rank = cards[0].cardRank.value;
  var badCards = cards.filter(card => card.cardRank.value !== rank);
  return !badCards;
}; // plugins


PresidentsSchema.plugin(_mongooseAutopopulate.default);

var Presidents = _model.default.discriminator('Presidents', PresidentsSchema);

var _default = Presidents;
exports.default = _default;