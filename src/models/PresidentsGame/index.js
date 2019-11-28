const mongoose = require('mongoose');
const Game = require('../Game');
const RulesSchema = require('./schemas/Rules');
const PlayerSchema = require('./schemas/Player');
const RoundSchema = require('./schemas/Round');
const TurnSchema = require('./schemas/Turn');

const PresidentsGameSchema = new mongoose.Schema({
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
PresidentsGameSchema.plugin(require('mongoose-autopopulate'));

// conditionals
PresidentsGameSchema.statics.areCardsValid = require('./conditionals/areCardsValid');
PresidentsGameSchema.statics.areCardsBetter = require('./conditionals/areCardsBetter');
PresidentsGameSchema.methods.shouldProcessTurn = require('./conditionals/shouldProcessTurn');
PresidentsGameSchema.methods.didCurrentPlayersLastTurnEndTheRound = require('./conditionals/didCurrentPlayersLastTurnEndTheRound');

// queries
PresidentsGameSchema.methods.getNextPlayer = require('./queries/getNextPlayer');

// updates
PresidentsGameSchema.methods.join = require('./updates/join');
PresidentsGameSchema.methods.initialize = require('./updates/initialize');
PresidentsGameSchema.methods.initializeNextRound = require('./updates/initializeNextRound');
PresidentsGameSchema.methods.processTurn = require('./updates/processTurn');
PresidentsGameSchema.methods.drinkDrink = require('./updates/drinkDrink');
PresidentsGameSchema.methods.giveDrink = require('./updates/giveDrink');

// utils
PresidentsGameSchema.statics.calculateSkips = require('./utils/calculateSkips');

const PresidentsGame = Game.discriminator('PresidentsGame', PresidentsGameSchema);

module.exports = PresidentsGame;