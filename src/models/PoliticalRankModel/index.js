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

PoliticalRankSchema.statics.getRanks = function(howMany) {
  return this.find({value: { $gt: 0 , $lt: howMany + 1 } });
}

PoliticalRankSchema.statics.getNullRank = function() {
  return this.find({value: 0});
}

const PoliticalRank = mongoose.model('PoliticalRank', PoliticalRankSchema);

module.exports = PoliticalRank;