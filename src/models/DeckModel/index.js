const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
  cards: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    required: true
  },
});


const DeckModel = mongoose.model('Deck', DeckSchema);

module.exports = DeckModel;