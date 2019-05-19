const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  }
});

const GameStateModel = mongoose.model('GameState', GameStateSchema);

module.exports = GameStateModel;