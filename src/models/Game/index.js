const mongoose = require('mongoose');

const options = { 
  discriminatorKey: 'kind',
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};
const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required to create a game.'],
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true, 'A createdAt is required to create a game.'],
  },
  startedAt: {
    type: Date,
  },
  finishedAt: {
    type: Date,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameStatus',
    required: [true, 'A status is required to create a game.'],
    autopopulate: true
  },
  config: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameConfiguration',
    required: [true, 'A config is required to create a game.'],
    autopopulate: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A createdBy is required to create a game.'],
    autopopulate: true
  },
  currentPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, options);

GameSchema.virtual('displayId').get(function() {
  const { name, kind } = this;
  return `${kind} - ${name}`;
});

GameSchema.plugin(require('mongoose-unique-validator'));
GameSchema.plugin(require('mongoose-autopopulate'));

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;