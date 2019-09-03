const mongoose = require('mongoose');
const Game = require('../Game');

const WarGameSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startedAt: {
    type: Date
  },
  rules: {
    reverseWar: {
      type: Boolean,
      required: true
    }
  },
  turns: [{
    player1Turn: {
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    player2Turn: {
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    causedBattle: {
      type: Boolean
    },
    player1Battle: {
      battleCardsDown: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Card'
      },
      battleCardUp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      }
    },
    player2Battle: {
      battleCardsDown: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Card'
      },
      battleCardUp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      }
    }
  }],
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    seatPosition: {
      type: Number
    },
    hand: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Card'
    },
    battlesWon: {
      type: Number
    },
    battlesLost: {
      type: Number
    }
  }]
});

const WarGame = Game.discriminator('WarGame', WarGameSchema);

module.exports = WarGame;