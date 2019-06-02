const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  currentPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  turns: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Turn'
  },
  playerRankAssignments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'RankAssignment'
  }
});

const RoundModel = mongoose.model('Round', RoundSchema);

module.exports = RoundModel;