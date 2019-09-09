const mongoose = require('mongoose');

const CardRankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for every card rank.'],
    unique: true
  },
  character: {
    type: String,
    required: [true, 'A character is required for every card rank.'],
    unique: true
  },
  value: {
    type: Number,
    required: [true, 'A value is required for every card rank.'],
    unique: true
  }
});

CardRankSchema.statics.getAll = function() {
  return this.find({});
}

CardRankSchema.statics.findByChar = function(character) {
  return this.findOne({character});
}

CardRankSchema.plugin(require('mongoose-unique-validator'));

const CardRank = mongoose.model('CardRank', CardRankSchema);

module.exports = CardRank;