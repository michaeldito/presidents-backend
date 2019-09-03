const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const { init: initCards, drop: dropCards } = require('../Card/test');
const { init: initGameStatuses, drop: dropGameStatuses } = require('../GameStatus/test');
const { init: initGameConfigurations, drop: dropGameConfigurations } = require('../GameConfiguration/test');

const Card = require('../Card');
const GameStatus = require('../GameStatus');
const GameConfiguration = require('../GameConfiguration');
const User = require('../User');
const WarGame = require('./');
const Game = require('../Game');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const name = 'test war game';
  const status = await GameStatus.findByStatus('NOT_STARTED');
  const config = await GameConfiguration.findOne({name: 'War'});
  const rules = { reverseWar: false };
  const cards = await Card.find({}).limit(8);

  const user1 = await User.findByUsername('tommypastrami');
  const card1 = cards[0];
  const player1Turn = {
    card: card1,
    user: user1
  };

  const user2 = await User.findByUsername('johnnyroastbeef');
  const card2 = cards[1];
  const player2Turn = {
    card: card2,
    user: user2
  };
  const causedBattle = true;

  const battleCardsDown1 = cards.slice(2, 4);
  const battleCardUp1 = cards[4];
  const player1Battle = {
    battleCardsDown: battleCardsDown1,
    battleCardUp: battleCardUp1
  };

  const battleCardsDown2 = cards.slice(5, 7);
  const battleCardUp2 = cards[7];
  const player2Battle = {
    battleCardsDown: battleCardsDown2,
    battleCardUp: battleCardUp2
  };

  const winner = user1;

  const player1 = { 
    user: user1,
    joinedAt: new Date(),
    seatPosition: 1,
    hand: battleCardsDown1,
    battlesWon: 1,
    battlesLost: 0
  };

  const player2 = { 
    user: user2,
    joinedAt: new Date(),
    seatPosition: 2,
    hand: battleCardsDown2,
    battlesWon: 0,
    battlesLost: 1
  };

  const game = {
    name,
    config,
    status, 
    winner,
    startedAt: new Date(),
    rules,
    currentPlayer: user1,
    turns: [{
      player1Turn,
      player2Turn,
      winner,
      causedBattle,
      player1Battle,
      player2Battle
    }],
    players: [player1, player2]
  };

  await WarGame.create(game);
}

const drop = async () => {
  await WarGame.deleteMany({});
}

const test = async () => describe('WarGame', function() {
    
  before(async function() {
    await db.connect();
    await Promise.all([
      initCardRanks(),
      initSuits()
    ]);
    await Promise.all([
      initUsers(),
      initGameStatuses(),
      initCards()
    ]);
    await initGameConfigurations();
  });

  after(async function() {
    await Promise.all([
      dropCardRanks(),
      dropSuits(),
      dropCards(),
      dropUsers(),
      dropGameStatuses(),
      dropGameConfigurations()
    ])
    await db.close();
  });

  it('Verify init() creates 1 war game document', async function() {  
    await init();  
    const docs = await WarGame.find({});
    docs[0].config.deck=[]
    console.log(JSON.stringify(docs[0], null, 2))
    expect(docs.length).toBe(1);
  });

  it('Verify drop() deletes all war game documents', async function() {    
    await drop();
    const docs = await Game.find({});
    expect(docs.length).toBe(0);
  });

});



const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  test();
}



module.exports = { init, drop, test };