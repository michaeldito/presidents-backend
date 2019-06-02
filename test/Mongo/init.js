const { CardModel, CardRankModel, GameModel, GameStateModel, 
  PlayerModel, PoliticalRankModel, SuitModel, UserModel, DeckModel,
  GameConfigModel } = require('../../src/models');

const { suits, cardRanks, politicalRanks, users, game } = require('./data');



// creates 9 political ranks
async function initPoliticalRanks() {
  const numberOfPoliticalRanks = await PoliticalRankModel.countDocuments({});
  if (numberOfPoliticalRanks === 9) {
    return;
  }

  let instances = politicalRanks.map(rank => new PoliticalRankModel(rank));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}



// creates 9 users
// then creates 9 players
async function initPlayers() {
  const numberOfPlayers = await PlayerModel.countDocuments({});
  if (numberOfPlayers === 9) {
    return;
  }
  let userInstances = users.map(user => new UserModel(user));
  let userPromises = userInstances.map(instance => instance.save());

  const nullRankInstance = await PoliticalRankModel.findByName('NullRank')
  const players = userInstances.map((user, idx) => {
    return {
      user: user._id,
      seatPosition: idx,
      drinksToDrink: 0,
      drinksDrunk: 0,
      rankAssignments: [nullRankInstance._id]
    }
  });

  let playerInstances = players.map(player => new PlayerModel(player));
  let playerPromises = playerInstances.map(instance => instance.save());

  return Promise.all([...userPromises, ...playerPromises]);
}



// creates 4 suits
// creates 13 card ranks
// creates 52 cards
// creates deck
// creates game config
async function initPresidents() {
  // do not init if already done
  const suitCount = await SuitModel.countDocuments({});
  const rankCount = await CardRankModel.countDocuments({});
  const cardCount = await CardModel.countDocuments({});
  const deckCount = await DeckModel.countDocuments({});
  const configCount = await GameConfigModel.countDocuments({});


  if (suitCount || rankCount || cardCount || deckCount || configCount) {
    throw new Error('Unable to init Presidents. Already initialized.');
  }

  let suitInstances = suits.map(suit => new SuitModel(suit));
  let suitPromises = suitInstances.map(instance => instance.save());

  let cardRankInstances = cardRanks.map(cardRank => new CardRankModel(cardRank));
  let cardRankPromises = cardRankInstances.map(instance => instance.save());

  let cards = [];

  for (suitInstance of suitInstances) {
    for (cardRankInstance of cardRankInstances) {
      let shortHand = cardRankInstance.character + suitInstance.name;
      cards.push({
        cardRank: cardRankInstance._id,
        suit: suitInstance._id,
        shortHand: shortHand
      });
    }
  }

  let cardInstances = cards.map(card => new CardModel(card));
  let cardPromises = cardInstances.map(instance => instance.save());


  let presidentsDeck = new DeckModel({
    cards: cardInstances,
  });

  let deckPromise = presidentsDeck.save();

  let presidentsConfig = new GameConfigModel({
    name: 'Presidents',
    maxPlayers: 8,
    deck: presidentsDeck
  });

  let gameConfigPromise = presidentsConfig.save();

  // init ranks first so initPlayers can grab null rank
  await initPoliticalRanks();

  return Promise.all([
    ...suitPromises, 
    ...cardRankPromises, 
    ...cardPromises, 
    deckPromise, 
    gameConfigPromise,
    initPlayers()
  ]);
}

async function dropAll() {
  return Promise.all([
    CardModel.deleteMany({}),
    CardRankModel.deleteMany({}),
    SuitModel.deleteMany({}),
    DeckModel.deleteMany({}),
    UserModel.deleteMany({}),
    PlayerModel.deleteMany({}),
    PoliticalRankModel.deleteMany({}),
    GameConfigModel.deleteMany({}),
    GameModel.deleteMany({})
  ])
}




module.exports = {initPresidents, dropAll}

// let deck = this.createDeck();
// let shuffledDeck = this.shuffle(deck);
// let playerHands = this.deal(numberOfPlayers, shuffledDeck);
// let sortedPlayersHands = playerHands.map(hand => this.sortCards(hand));
// const whoseTurnIdx = this.find3Clubs(sortedPlayersHands);