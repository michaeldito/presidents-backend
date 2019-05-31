const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  }
});

GameStateSchema.statics.findByState = function(state) {
  return this.findOne({state});
}

const GameStateModel = mongoose.model('GameState', GameStateSchema);

module.exports = GameStateModel;