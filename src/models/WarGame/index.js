const mongoose = require('mongoose');
const Game = require('../Game');
const Card = require('../Card');

const WarBattleSchema = new mongoose.Schema({
  battleCardsDown: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    required: [true, 'A value for battleCardsDown is required.'],
    validate: {
      validator: async function(cards) {

        // two object ids are required
        if (cards.length !== 2)
          return Promise.reject(new Error('battle cards down must contain two cards.'));
        
        // the object ids must be Cards
        const docs = await Card.find({'_id': { $in: cards }});
        if (docs.length !== cards.length)
          return Promise.reject(new Error('battle cards down objectId does not reference a card'));
          
        // two cards were passed in
        return Promise.resolve();

      },
      message: 'battle cards down must contain two Card ObjectIds.'
    }
  },
  battleCardUp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: [true, 'A value for battleCardUp is required.']
  }
});

const WarTurnSchema = new mongoose.Schema({
  player1Turn: {
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: [true, 'A value for turns[i].player1Turn.card is required.']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A value for turns[i].player1Turn.user is required.']
    }
  },
  player2Turn: {
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: [true, 'A value for turns[i].player2Turn.card is required.']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A value for turns[i].player2Turn.user is required.']
    }
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  causedBattle: {
    type: Boolean,
    required: [true, 'A value for turns[i].causedBattle is required.']
  },
  player1Battle: {
    type: WarBattleSchema,
    required: [true, 'A value for turns[i].player1Battle is required.']
  },
  player2Battle: {
    type: WarBattleSchema,
    required: [true, 'A value for turns[i].player2Battle is required.']
  },
});

const WarPlayerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].user is required.']
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  seatPosition: {
    type: Number,
    required: [true, 'A value for players[i].seatPosition is required.']
  },
  hand: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  battlesWon: {
    type: Number,
    required: [true, 'A value for players[i].battlesWon is required.']
  },
  battlesLost: {
    type: Number,
    required: [true, 'A value for players[i].battlesLost is required.']
  }
});

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
      required: [true, 'A value is required for rules.reverseWar to create a war game.']
    }
  },
  turns: {
    type: [WarTurnSchema],
    required: true
  },
  players: {
    type: [WarPlayerSchema],
    required: true
  },
});

const WarGame = Game.discriminator('WarGame', WarGameSchema);

module.exports = WarGame;