const { CardModel, CardRankModel, GameModel, GameStateModel, 
  PlayerModel, PoliticalRankModel, SuitModel, UserModel } = require('../../src/models');

const { suits, cardRanks, politicalRanks, states, users, game } = require('./data');

// creates 4 suits
// creates 13 card ranks
// then creates 52 cards
async function initCards() {
  const currentNumberOfCards = await CardModel.countDocuments({});
  if (currentNumberOfCards === 52) {
    return;
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

  return Promise.all([...suitPromises, ...cardRankPromises, ...cardPromises]);
}

// creates 8 political ranks
async function initPoliticalRanks() {
  const numberOfPoliticalRanks = await PoliticalRankModel.countDocuments({});
  if (numberOfPoliticalRanks === 8) {
    return;
  }

  let instances = politicalRanks.map(rank => new PoliticalRankModel(rank));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

// creates 3 game states
async function initGameStates() {
  const numberOfGameStates = await GameStateModel.countDocuments({});
  if (numberOfGameStates === 3) {
    return;
  }

  let instances = states.map(state => new GameStateModel(state));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

// creates 2 users
async function initUsers() {
  const numberOfUsers = await UserModel.countDocuments({});
  if (numberOfUsers === 2) {
    return;
  }

  let instances = users.map(user => new UserModel(user));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

// creates 2 users
// then creates 2 players
async function initPlayers() {
  const numberOfPlayers = await PlayerModel.countDocuments({});
  if (numberOfPlayers === 2) {
    return;
  }
  let userInstances = users.map(user => new UserModel(user));
  let userPromises = userInstances.map(instance => instance.save());


  const players = userInstances.map((user, idx) => {
    return {
      user: user._id,
      seatPosition: idx,
      drinksToDrink: 0,
      drinksDrunk: 0
    }
  });

  let playerInstances = players.map(player => new PlayerModel(player));
  let playerPromises = playerInstances.map(instance => instance.save());

  return Promise.all([...userPromises, ...playerPromises]);
}

// create 1 players
// have player create the game
async function initGame() {
  const numberOfGames = await GameModel.countDocuments({});
  if (numberOfGames === 1) {
    return;
  }

  // create 1 user
  let userInstance = new UserModel(users[0]);

  let userPromise = userInstance.save();
  const player = {
    user: userInstance._id,
    seatPosition: 0,
    drinksToDrink: 0,
    drinksDrunk: 0
  };

  let playerInstance = new PlayerModel(player);
  let playerPromise = playerInstance.save();

  // have one player create the game
  const NOT_STARTED = await GameStateModel.findOne({state: 'NOT_STARTED'});
  const newGame = new GameModel({
    name: game.name,
    gameState: NOT_STARTED._id,
    players: [playerInstance._id],
  });
  let gamePromise = newGame.save();
  
  return Promise.all([userPromise, playerPromise, gamePromise]);
}


module.exports = { initCards, initPoliticalRanks, initGameStates, 
  initUsers, initPlayers, initGame };


// let deck = this.createDeck();
// let shuffledDeck = this.shuffle(deck);
// let playerHands = this.deal(numPlayers, shuffledDeck);
// let sortedPlayersHands = playerHands.map(hand => this.sortCards(hand));
// const whoseTurnIdx = this.find3Clubs(sortedPlayersHands);