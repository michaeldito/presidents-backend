const { CardModel, CardRankModel, GameModel, 
  PlayerModel, PoliticalRankModel, SuitModel, UserModel, DeckModel,
  GameConfigModel } = require('../../src/models');

const { suits, cardRanks, politicalRanks, users, gameConfig } = require('./data');



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
async function initUsers() {
  const numberOfUsers = await UserModel.countDocuments({});
  if (numberOfUsers === 9) {
    return;
  }
  let userInstances = users.map(user => new UserModel(user));
  let userPromises = userInstances.map(instance => instance.save());
  return Promise.all([...userPromises]);
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
    name: gameConfig.name,
    maxPlayers: gameConfig.maxPlayers,
    deck: presidentsDeck
  });

  let gameConfigPromise = presidentsConfig.save();
  await initPoliticalRanks();

  return Promise.all([
    ...suitPromises, 
    ...cardRankPromises, 
    ...cardPromises, 
    deckPromise, 
    gameConfigPromise,
    initUsers()
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