const { CardModel, CardRankModel, GameModel, GameStateModel, 
  PlayerModel, PoliticalRankModel, SuitModel, UserModel } = require('../../models');
const { 
  ranks, 
  suitNames, 
  characters,
  colors,
  values,
  createDeck,
  shuffle,
  deal,
  intValue,
  sortCards,
  find3Clubs,
  nextPlayerIdx 
} = require('../../utils');

const mongoose = require('mongoose');

require('dotenv').config();
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI_TEST, options).then(
  () =>  { console.log("[Database] √") },
  err => { console.log("[Database] X ", err) }
);

// init suits

const suits = [
  {
    name: 'Clubs',
    color: 'Black',
    character: '\u2663',
    value: 0
  },
  {
    name: 'Diamonds',
    color: 'Red',
    character: '\u2666',
    value: 1
  },
  {
    name: 'Hearts',
    color: 'Red',
    character: '\u2665',
    value: 2
  },
  {
    name: 'Spades',
    color: 'Black',
    character: '\u2660',
    value: 3
  },
];

let suitInstances = suits.map(suit => new SuitModel(suit));
suitInstances.forEach(async (instance) => {
  try {
    await instance.save();
    console.log("[Suit Insert] √");
  } catch(err) {
    console.log("[Suit Insert] X ", err);
  }
});


// init card rank

let cardRanks = [
  {
    name: '2',
    character: '2',
    value: 2
  },
  {
    name: '3',
    character: '3',
    value: 3
  },
  {
    name: '4',
    character: '4',
    value: 4
  },
  {
    name: '5',
    character: '5',
    value: 5
  },
  {
    name: '6',
    character: '6',
    value: 6
  },
  {
    name: '7',
    character: '7',
    value: 7
  },
  {
    name: '8',
    character: '8',
    value: 8
  },
  {
    name: '9',
    character: '9',
    value: 9
  },
  {
    name: '10',
    character: '10',
    value: 10
  },
  {
    name: 'Jack',
    character: 'J',
    value: 11
  },
  {
    name: 'Queen',
    character: 'Q',
    value: 12
  },
  {
    name: 'King',
    character: 'K',
    value: 13
  },
  {
    name: 'Ace',
    character: 'A',
    value: 14
  },
]

let cardRankInstances = cardRanks.map(cardRank => new CardRankModel(cardRank));
cardRankInstances.forEach(async (instance) => {
  try {
    await instance.save();
    console.log("[cardRankInstances Insert] √");
  } catch(err) {
    console.log("[cardRankInstances Insert] X ", err);
  }
});


// init cards

let cards = [];

for (suitInstance of suitInstances) {
  for (cardRankInstance of cardRankInstances) {
    cards.push({
      cardRank: cardRankInstance._id,
      suit: suitInstance._id
    });
  }
}

let cardInstances = cards.map(card => new CardModel(card));
cardInstances.forEach(async (instance) => {
  try {
    await instance.save();
    console.log("[cardInstances Insert] √");
  } catch(err) {
    console.log("[cardInstances Insert] X ", err);
  }
});

// init politcal cranks
let politicalRanks = [{
  name: 'President',
  value: 8
},
{
  name: 'Vice President',
  value: 7
},
{
  name: 'Speaker of the House',
  value: 6
},
{
  name: 'President Pro Tempore of the Senate',
  value: 5
},
{
  name: 'Secretary of State',
  value: 4
},
{
  name: 'Secretary of the Treasury',
  value: 3
},
{
  name: 'Secretary of Defense',
  value: 2
},
{
  name: 'Asshole',
  value: 1
}]

let politicalRankInstances = politicalRanks.map(rank => new PoliticalRankModel(rank));
politicalRankInstances.forEach(async (instance) => {
  try {
    await instance.save();
    console.log("[politicalRankInstances Insert] √");
  } catch(err) {
    console.log("[politicalRankInstances Insert] X ", err);
  }
});

// init game states
const states = [{
  state: 'NOT_STARTED'
},
{
  state: 'IN_PROGRESS'
},
{
  state: 'FINALIZED'
}];

let stateInstances = states.map(state => new GameStateModel(state));
stateInstances.forEach(async (instance) => {
  try {
    await instance.save();
    console.log("[stateInstances Insert] √");
  } catch(err) {
    console.log("[stateInstances Insert] X ", err);
  }
});


// make promises that save each instance, then save all

// Promise.all(promises).then(() => {
//   console.log('docs all saved')
// }).catch(error => {
//   console.log(error);
// })

// let deck = this.createDeck();
// let shuffledDeck = this.shuffle(deck);
// let playerHands = this.deal(numPlayers, shuffledDeck);
// let sortedPlayersHands = playerHands.map(hand => this.sortCards(hand));
// const whoseTurnIdx = this.find3Clubs(sortedPlayersHands);