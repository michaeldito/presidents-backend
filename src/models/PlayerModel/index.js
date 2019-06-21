const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  seatPosition: {
    type: Number
  },
  drinksToDrink: {
    type: Number
  },
  drinksDrunk: {
    type: Number
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  hand: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    autopopulate: true
  },
  turns: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Turn',
  },
  rankAssignments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'RankAssignment',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

PlayerSchema.plugin(require('mongoose-autopopulate'));

PlayerSchema.statics.findAll = function() {
  return this.find({});
}

PlayerSchema.statics.findRandom = function() {
  return this.findOne({});
}

PlayerSchema.statics.findRandoms = function(howMany) {
  return this.find({}).limit(howMany);
}

PlayerSchema.statics.findByUsername = async function(username) {
  const user = await this.model('User').findOne({username});
  return this.findOne({user: user._id});
}

PlayerSchema.statics.find3ClubsForGame = async function(game) {
  return this.findOne({game});
}


const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;