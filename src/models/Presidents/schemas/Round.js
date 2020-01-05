const mongoose = require('mongoose');
const TurnSchema = require('./Turn');

const options = { 
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};
const RoundSchema = new mongoose.Schema({
  startedAt: {
    type: Date,
    default: Date.now
  },
  turns: {
    type: [TurnSchema],
  }
}, options);


RoundSchema.virtual('displayId').get(function() {
  let { startedAt, turns, _id } = this;
  return `${startedAt} - ${turns.length} turns - ${_id} `;
});


module.exports = RoundSchema;