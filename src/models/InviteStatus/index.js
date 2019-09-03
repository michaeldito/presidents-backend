const mongoose = require('mongoose');
const Status = require('../Status');

const InviteStatus = Status.discriminator('InviteStatus', new mongoose.Schema({}));

module.exports = InviteStatus;