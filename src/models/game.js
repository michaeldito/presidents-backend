const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  whoseTurnIdx: {
    type: Number,
    required: true,
    trim: true,
    minlength: 1
  },
  handToBeat: [{
    rank: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    suite: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    }
  }],
  players: [{
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    hand: [
      {
        rank: {
          type: String,
          required: true,
          trim: true,
          minlength: 1
        },
        suite: {
          type: String,
          required: true,
          trim: true,
          minlength: 1
        }
      }
    ]
  }]
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;