const mongoose = require('mongoose');

const InviteStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
});

InviteStatusSchema.statics.findByStatus = function(status) {
  return this.findOne({status});
}

const InviteStatus = mongoose.model('InviteStatus', InviteStatusSchema);

module.exports = InviteStatus;