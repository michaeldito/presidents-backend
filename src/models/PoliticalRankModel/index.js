const mongoose = require('mongoose');

const PoliticalRankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

PoliticalRankSchema.statics.findByName = function(name) {
  return this.findOne({name});
}

PoliticalRankSchema.statics.findByValue = function(value) {
  return this.findOne({value});
}

const PoliticalRank = mongoose.model('PoliticalRank', PoliticalRankSchema);

module.exports = PoliticalRank;