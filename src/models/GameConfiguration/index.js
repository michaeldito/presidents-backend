const mongoose = require('mongoose');

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
      validator: function(arr) {
        return arr.length === 0 ? 
          false : 
          arr.every(v => mongoose.Types.ObjectId.isValid(v));
      },
      message: 'A deck cannot be empty or have non ObjectId values.'
    }

  },
  numDecks: {
    type: Number,
    required: [true, 'A numDecks field is required for every game configuration.'],
  }
});

GameConfigurationSchema.plugin(require('mongoose-autopopulate'));

const GameConfiguration = mongoose.model('GameConfiguration', GameConfigurationSchema);

module.exports = GameConfiguration;