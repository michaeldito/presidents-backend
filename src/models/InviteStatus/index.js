const mongoose = require('mongoose');
const Status = require('../Status');

const InviteStatusSchema = new mongoose.Schema({});
const InviteStatus = Status.discriminator('InviteStatus', InviteStatusSchema);

module.exports = InviteStatus;