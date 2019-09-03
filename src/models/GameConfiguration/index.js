const mongoose = require('mongoose');
const Card = require('../Card');

const GameConfigurationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for every game configuration.'],
    trim: true,
    unique: true,
  },
  maxPlayers: {
    type: Number,
    required: [true, 'A maxPlayers field is required for every game configuration.'],
  },
  deck: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    required: true, // mongoose will make empty array by default if required is true
    validate: {
      validator: async function(deck) {
        // deck must not be empty
        if(deck.length === 0)
          return Promise.reject(new Error('empty deck'));

        // deck must contain ObjectIds
        const areAllObjectIdsValid = deck.every(card => mongoose.Types.ObjectId.isValid(card));
        if (! areAllObjectIdsValid)
          return Promise.reject(new Error('bad objectId'));

        // deck must contain Cards
        const docs = await Card.find({'_id': { $in: deck }});
        if (docs.length !== deck.length)
          return Promise.reject(new Error('objectId does not reference a card'));
          
        // deck is valid
        return Promise.resolve();
      },
      message: 'A deck must be a non-empty array of Card ObjectIds.'
    }
  },
  numDecks: {
    type: Number,
    required: [true, 'A numDecks field is required for every game configuration.'],
  }
});

const GameConfiguration = mongoose.model('GameConfiguration', GameConfigurationSchema);

module.exports = GameConfiguration;