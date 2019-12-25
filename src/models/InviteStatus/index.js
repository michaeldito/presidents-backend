const mongoose = require('mongoose');
const Status = require('../Status');

const InviteStatusSchema = new mongoose.Schema({});
InviteStatusSchema.statics.getMessage = function() {
  return 'message from invite status - statics';
}

const InviteStatus = Status.discriminator('InviteStatus', InviteStatusSchema);

module.exports = InviteStatus;