const mongoose = require('mongoose');
const InboxItem = require('../InboxItem');

const InviteSchema = new mongoose.Schema({
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A sentBy is required to create an invite.']
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InviteStatus',
    required: [true, 'A status is required to create an invite.']
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'A game is required to create an invite.']
  }
});

const Invite = InboxItem.discriminator('Invite', InviteSchema);

module.exports = Invite;