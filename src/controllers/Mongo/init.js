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

// init politcal cranks
let politicalRanks = [
{
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

// init game states
const states = [
  {
  state: 'NOT_STARTED'
},
{
  state: 'IN_PROGRESS'
},
{
  state: 'FINALIZED'
}];


async function initCards() {
  const currentNumberOfCards = await CardModel.countDocuments({});

  if (currentNumberOfCards === 52) {
    return;
  }

  let suitInstances = suits.map(suit => new SuitModel(suit));
  let suitPromises = suitInstances.map(instance => instance.save());

  let cardRankInstances = cardRanks.map(cardRank => new CardRankModel(cardRank));
  let cardRankPromises = cardRankInstances.map(instance => instance.save());

  // init cards
  let cards = [];

  for (suitInstance of suitInstances) {
    for (cardRankInstance of cardRankInstances) {
      let shortHand = cardRankInstance.character + suitInstance.name[0];
      cards.push({
        cardRank: cardRankInstance._id,
        suit: suitInstance._id,
        shortHand: shortHand
      });
    }
  }

  let cardInstances = cards.map(card => new CardModel(card));
  let cardPromises = cardInstances.map(instance => instance.save());

  return Promise.all([...suitPromises, ...cardRankPromises, ...cardPromises]);
}

async function initPoliticalRanks() {
  let numberOfPoliticalRanks = await PoliticalRankModel.countDocuments({});
  if (numberOfPoliticalRanks === 8) {
    return;
  }
  let instances = politicalRanks.map(rank => new PoliticalRankModel(rank));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

async function initGameStates() {
  let instances = states.map(state => new GameStateModel(state));
  let numberOfGameStates = await GameStateModel.countDocuments({});

  if (numberOfGameStates === 3) {
    return;
  }

  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

module.exports = { initCards, initPoliticalRanks, initGameStates };


// let deck = this.createDeck();
// let shuffledDeck = this.shuffle(deck);
// let playerHands = this.deal(numPlayers, shuffledDeck);
// let sortedPlayersHands = playerHands.map(hand => this.sortCards(hand));
// const whoseTurnIdx = this.find3Clubs(sortedPlayersHands);