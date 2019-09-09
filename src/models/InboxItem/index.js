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

const InboxItem = mongoose.model('InboxItem', InboxItemSchema);

module.exports = InboxItem;