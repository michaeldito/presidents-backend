const mongoose = require('mongoose');

const TurnSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  cards: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    required: true
  },
  pass: {
    type: Boolean
  },
  causeSkips: {
    type: Boolean
  },
  skipsRemaining: {
    type: Number
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
    required: true
  },
});

const TurnModel = mongoose.model('Turn', TurnSchema);

module.exports = TurnModel;