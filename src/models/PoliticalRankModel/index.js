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

const PoliticalRank = mongoose.model('PoliticalRank', PoliticalRankSchema);

module.exports = PoliticalRank;