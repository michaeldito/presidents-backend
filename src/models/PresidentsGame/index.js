const mongoose = require('mongoose');
const Game = require('../Game');

const PresidentsRulesSchema = new mongoose.Schema({
  doubleSkips: {
    type: Boolean,
    required: [true, 'A value for rules.doubleSkips is required to create a Presidents game.']
  },
  scumStarts: {
    type: Boolean,
    required: [true, 'A value for rules.scumStarts is required to create a Presidents game.']
  },
  scumHandsTwo: {
    type: Boolean,
    required: [true, 'A value for rules.scumHandsTwo is required to create a Presidents game.']
  },
  oneEyedJacksAndKingOfHearts: {
    type: Boolean,
    required: [true, 'A value for rules.oneEyedJacksAndKingOfHearts is required to create a Presidents game.']
  },
  reversePresidentScumTrade: {
    type: Boolean,
    required: [true, 'A value for rules.reversePresidentScumTrade is required to create a Presidents game.']
  },
  presidentDeals: {
    type: Boolean,
    required: [true, 'A value for rules.presidentDeals is required to create a Presidents game.']
  },
  goLow: {
    type: Boolean,
    required: [true, 'A value for rules.goLow is required to create a Presidents game.']
  },
  equalNumber: {
    type: Boolean,
    required: [true, 'A value for rules.equalNumber is required to create a Presidents game.']
  },
  noEndOnBomb: {
    type: Boolean,
    required: [true, 'A value for rules.noEndOnBomb is required to create a Presidents game.']
  },
  tripleSixes: {
    type: Boolean,
    required: [true, 'A value for rules.tripleSixes is required to create a Presidents game.']
  },
  passOut: {
    type: Boolean,
    required: [true, 'A value for rules.passOut is required to create a Presidents game.']
  },
  fourInARow: {
    type: Boolean,
    required: [true, 'A value for rules.fourInARow is required to create a Presidents game.']
  },
  larryPresidents: {
    type: Boolean,
    required: [true, 'A value for rules.larryPresidents is required to create a Presidents game.']
  }
});

const PresidentsTurnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for rounds[i].turns[i].user is required.']
  },
  takenAt: {
    type: Date,
    default: Date.now
  },
  cardsPlayed: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  wasPassed: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].wasPassed is required.']
  },
  wasSkipped: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].wasSkipped is required.']
  },
  didCauseSkips: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].didCauseSkips is required.']
  },
  skipsRemaining: {
    type: Number,
    required: [true, 'A value for rounds[i].turns[i].skipsRemaining is required.']
  },
  endedRound: {
    type: Boolean,
    required: [true, 'A value for rounds[i].turns[i].endedRound is required.']
  }
});

const RoundSchema = new mongoose.Schema({
  startedAt: {
    type: Date,
    default: Date.now
  },
  turns: {
    type: [PresidentsTurnSchema],
  }
});

const PresidentsPlayerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].user is required.']
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  seatPosition: {
    type: Number,
    required: [true, 'A value for players[i].seatPosition is required.']
  },
  hand: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    autopopulate: true
  },
  politicalRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank'
  },
  nextGameRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank'
  },
  drinksDrunk: {
    type: Number
  },
  drinksReceived: [{
    createdAt: {
      type: Date,
      default: Date.now()
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A value for players[i].drinksReceived.sentBy is required.']
    }
  }],
  drinksSent: [{
    createdAt: {
      type: Date
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A value for players[i].drinksSent.sentTo is required.']
    }
  }]
});
PresidentsPlayerSchema.plugin(require('mongoose-autopopulate'));

const PresidentsGameSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  handToBeat: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    autopopulate: true
  },
  rules: {
    type: PresidentsRulesSchema,
    required: [true, 'A value for rules is required to create a Presidents game.']
  },
  rounds: {
    type: [RoundSchema],
    required: true
  },
  players: {
    type: [PresidentsPlayerSchema],
    required: true
  }
});

// plugins
PresidentsGameSchema.plugin(require('mongoose-autopopulate'));

// conditionals
PresidentsGameSchema.statics.areCardsValid = require('./conditionals/areCardsValid');
PresidentsGameSchema.statics.areCardsBetter = require('./conditionals/areCardsBetter');
PresidentsGameSchema.statics.shouldProcessTurn = require('./conditionals/shouldProcessTurn');

// queries
PresidentsGameSchema.methods.getNextPlayer = require('./queries/getNextPlayer');

// updates
PresidentsGameSchema.methods.join = require('./updates/join');
PresidentsGameSchema.methods.initialize = require('./updates/initialize');
PresidentsGameSchema.methods.initializeNextRound = require('./updates/initializeNextRound');
PresidentsGameSchema.methods.processTurn = require('./updates/processTurn');
PresidentsGameSchema.methods.processSkips = require('./updates/processSkips');

// utils
PresidentsGameSchema.statics.calculateSkips = require('./utils/calculateSkips');

const PresidentsGame = Game.discriminator('PresidentsGame', PresidentsGameSchema);

module.exports = PresidentsGame;