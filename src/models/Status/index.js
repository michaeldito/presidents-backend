const mongoose = require('mongoose');

const options = { 
  discriminatorKey: 'kind'
};

const StatusSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
}, options);

StatusSchema.statics.findByValue = function(value) {
  return this.findOne({value});
}

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;