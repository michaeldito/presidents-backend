const mongoose = require('mongoose');
const Game = require('../Game');
const RulesSchema = require('./schemas/Rules');
const PlayerSchema = require('./schemas/Player');
const RoundSchema = require('./schemas/Round');
const TurnSchema = require('./schemas/Turn');

const PresidentsSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  turnToBeat: {
    type: TurnSchema,
  },
  rules: {
    type: RulesSchema,
    required: [true, 'A value for rules is required to create a Presidents game.']
  },
  rounds: {
    type: [RoundSchema],
    required: true
  },
  players: {
    type: [PlayerSchema],
    required: true
  },
  drinks: []
});

// plugins
PresidentsSchema.plugin(require('mongoose-autopopulate'));

// conditionals
PresidentsSchema.statics.areCardsValid = require('./conditionals/areCardsValid');
PresidentsSchema.statics.areCardsBetter = require('./conditionals/areCardsBetter');
PresidentsSchema.methods.shouldProcessTurn = require('./conditionals/shouldProcessTurn');
PresidentsSchema.methods.didCurrentPlayersLastTurnEndTheRound = require('./conditionals/didCurrentPlayersLastTurnEndTheRound');

// queries
PresidentsSchema.methods.getNextPlayer = require('./queries/getNextPlayer');

// updates
PresidentsSchema.methods.join = require('./updates/join');
PresidentsSchema.methods.initialize = require('./updates/initialize');
PresidentsSchema.methods.initializeNextRound = require('./updates/initializeNextRound');
PresidentsSchema.methods.processTurn = require('./updates/processTurn');
PresidentsSchema.methods.drinkDrink = require('./updates/drinkDrink');
PresidentsSchema.methods.giveDrink = require('./updates/giveDrink');

// utils
PresidentsSchema.statics.calculateSkips = require('./utils/calculateSkips');

const Presidents = Game.discriminator('Presidents', PresidentsSchema);

module.exports = Presidents;