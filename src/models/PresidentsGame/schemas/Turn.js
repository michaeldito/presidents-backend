const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
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
