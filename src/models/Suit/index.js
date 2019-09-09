const mongoose = require('mongoose');

const SuitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for every suit.'],
    unique: true
  },
  color: {
    type: String,
    required: [true, 'A color is required for every suit.']
  },
  character: {
    type: String,
    required: [true, 'A character is required for every suit.'],
    unique: true
  },
  value: {
    type: Number,
    required: [true, 'A value is required for every suit.'],
    unique: true
  }
});

SuitSchema.statics.findAll = function() {
  return this.find({});
}

SuitSchema.statics.findByName = function(name) {
  return this.findOne({name});
}

SuitSchema.plugin(require('mongoose-unique-validator'));

const Suit = mongoose.model('Suit', SuitSchema);

module.exports = Suit;