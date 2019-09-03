const mongoose = require('mongoose');

const GameStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
});

GameStatusSchema.statics.findByStatus = function(status) {
  return this.findOne({status});
}

const GameStatus = mongoose.model('GameStatus', GameStatusSchema);

module.exports = GameStatus;