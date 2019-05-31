const mongoose = require('mongoose');

const SuitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
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

SuitSchema.statics.findAll = function() {
  return this.find({});
}

SuitSchema.statics.findByName = function(name) {
  return this.findOne({name});
}

const SuitModel = mongoose.model('Suit', SuitSchema);

module.exports = SuitModel;