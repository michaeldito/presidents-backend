const mongoose = require('mongoose');

const options = { 
  discriminatorKey: 'kind'
};

const InboxItemSchema = new mongoose.Schema({
  forUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seenByUser: {
    type: Boolean,
    required: true
  }
}, options);

const InboxItem = mongoose.model('InboxItem', InboxItemSchema);

module.exports = InboxItem;