const mongoose = require('mongoose');
const InboxItem = require('../InboxItem');

const InviteSchema = new mongoose.Schema({
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InviteStatus',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  }
});

const Invite = InboxItem.discriminator('Invite', InviteSchema);

module.exports = Invite;