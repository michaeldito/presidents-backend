const mongoose = require('mongoose');
const Status = require('../../Status/model');

const InviteStatusSchema = new mongoose.Schema({});
const InviteStatus = Status.discriminator('InviteStatus', InviteStatusSchema);

module.exports = InviteStatus;