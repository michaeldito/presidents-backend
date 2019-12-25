const mongoose = require('mongoose');
const Status = require('../Status');

const GameStatusSchema = new mongoose.Schema({});
GameStatusSchema.statics.getMessage = function() {
  return 'message from game status - statics';
}
GameStatusSchema.methods.getMessage2 = function() {
  return 'message from game status - methods';
}

const GameStatus = Status.discriminator('GameStatus', GameStatusSchema);

module.exports = GameStatus;