const mongoose = require('mongoose');

const GameConfigSchema = new mongoose.Schema({
  maxPlayers: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
});


const GameConfigModel = mongoose.model('GameConfigModel', GameConfigSchema);

module.exports = GameConfigModel;