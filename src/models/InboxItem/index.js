const mongoose = require('mongoose');

const options = { 
  discriminatorKey: 'kind'
};

const InboxItemSchema = new mongoose.Schema({
  forUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A forUser is required to create an inbox item.']
  },
  seenByUser: {
    type: Boolean,
    required: [true, 'A seenByUser is required to create an inbox item.']
  }
}, options);

InboxItemSchema.virtual('kind').get(function() {
  return 'InboxItem';
});
InboxItemSchema.virtual('displayId').get(function() {
  const username = this.forUser.username;
  const seenByUser = this.seenByUser;
  return `${username} - ${seenByUser}`
});
InboxItemSchema.set('toObject', { virtuals: true });
InboxItemSchema.set('toJSON', { virtuals: true });

const InboxItem = mongoose.model('InboxItem', InboxItemSchema);

module.exports = InboxItem;