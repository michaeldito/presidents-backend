const mongoose = require('mongoose');

const RankAssignmentSchema = new mongoose.Schema({
  politicalRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
    required: true
  },
});


const RankAssignmentModel = mongoose.model('RankAssignment', RankAssignmentSchema);

module.exports = RankAssignmentModel;