const mongoose = require('mongoose');

const options = { 
  discriminatorKey: 'kind'
};

const StatusSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, 'A Status must have a value to be created.'],
    trim: true,
    unique: [true, 'A Status must have a unique value to be created'],
  }
}, options);

StatusSchema.statics.findByValue = function(value) {
  return this.findOne({value});
}

StatusSchema.statics.getMessage = function() {
  return 'message from status - statics';
}

StatusSchema.methods.getMessage2 = function() {
  return 'message from status - methods';
}

StatusSchema.plugin(require('mongoose-unique-validator'));

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;