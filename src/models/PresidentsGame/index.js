const mongoose = require('mongoose');
const Game = require('../Game');

const PresidentsSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rules: {
    doubleSkips: {
      type: Boolean,
      required: true
    },
    scumStarts: {
      type: Boolean,
      required: true
    },
    scumHandsTwo: {
      type: Boolean,
      required: true
    },
    oneEyedJacksAndKingOfHearts: {
      type: Boolean,
      required: true
    },
    reversePresidentScumTrade: {
      type: Boolean,
      required: true
    },
    presidentDeals: {
      type: Boolean,
      required: true
    },
    goLow: {
      type: Boolean,
      required: true
    },
    equalNumber: {
      type: Boolean,
      required: true
    },
    noEndOnBomb: {
      type: Boolean,
      required: true
    },
    tripleSixes: {
      type: Boolean,
      required: true
    },
    passOut: {
      type: Boolean,
      required: true
    },
    fourInARow: {
      type: Boolean,
      required: true
    },
    larryPresidents: {
      type: Boolean,
      required: true
    }
  },
  rounds: [{
    startedAt: {
      type: Date
    },
    turns: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
        default: false
      },
      wasSkipped: {
        type: Boolean
      },
      didCauseSkips: {
        type: Boolean
      },
      skipsRemaining: {
        type: Number
      },
      endedRound: {
        type: Boolean
      }
    }]
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
    politicalRank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalRank'
    },
    nextGameRank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalRank'
    },
    drinksDrunk: {
      type: Number
    },
    drinksReceived: [{
      createdAt: {
        type: Date
      },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    drinksSent: [{
      createdAt: {
        type: Date
      },
      sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
  }]
});

PresidentsSchema.plugin(require('mongoose-autopopulate'));

const PresidentsGame = Game.discriminator('PresidentsGame', PresidentsSchema);

module.exports = PresidentsGame;