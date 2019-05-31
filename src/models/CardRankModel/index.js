const mongoose = require('mongoose');

const CardRankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  character: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

CardRankSchema.statics.getAll = function() {
  return this.find({});
}

CardRankSchema.statics.findByChar = function(character) {
  return this.findOne({character});
}

const CardRankModel = mongoose.model('CardRank', CardRankSchema);

module.exports = CardRankModel;