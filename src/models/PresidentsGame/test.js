const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initCards, drop: dropCards } = require('../Card/test');
const { init: initGameStatuses, drop: dropGameStatuses } = require('../GameStatus/test');
const { init: initGameConfigurations, drop: dropGameConfigurations } = require('../GameConfiguration/test');
const { init: initPoliticalRanks, drop: dropPoliticalRanks } = require('../PoliticalRank/test');

const Card = require('../Card');
const GameStatus = require('../GameStatus');
const GameConfiguration = require('../GameConfiguration');
const User = require('../User');
const PoliticalRank = require('../PoliticalRank');
const PresidentsGame = require('./');
const Game = require('../Game');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const status = await GameStatus.findByValue('NOT_STARTED');
  const config = await GameConfiguration.findOne({name: 'Presidents'});
  const currentPlayer = await User.findByUsername('tommypastrami');
  const cardsPlayed = await Card.find({shortHand: '3Clubs'});
  const hand = await Card.find({}).limit(5);
  const user = currentPlayer;
  const name = 'test prez game';
  const rules = {
    doubleSkips: false,
    scumStarts: false,
    scumHandsTwo: false,
    oneEyedJacksAndKingOfHearts: false,
    reversePresidentScumTrade: false,
    presidentDeals: false,
    goLow: false,
    equalNumber: false,
    noEndOnBomb: false,
    tripleSixes: false,
    passOut: false,
    fourInARow: false,
    larryPresidents: true
  };

  const winner = user;
  const politicalRank = await PoliticalRank.findByName('President');
  const nextGameRank = politicalRank;
  const drinksDrunk = 0;
  const drinksReceived = [{ createdAt: new Date(), sentBy: user }];
  const drinksSent = [{ createdAt: new Date(), sentTo: user }];

  const game = {
    winner,
    name,
    status,
    config,
    rules,
    currentPlayer,
    rounds: [{
      startedAt: new Date(),
      turns: [{
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: false,
        user,
        takenAt: new Date(),
        cardsPlayed
      }]
    }],
    players: [{
      user,
      joinedAt: new Date(),
      seatPosition: 1,
      hand,
      politicalRank,
      nextGameRank,
      drinksDrunk,
      drinksReceived,
      drinksSent
    }]
  }

  await PresidentsGame.create(game);
}

const drop = async () => {
  await PresidentsGame.deleteMany({});
}

const test = async () => describe('PresidentsGame', function() {
    
  before(async function() {
    await db.connect();
    await Promise.all([
      initCardRanks(),
      initSuits()
    ]);
    await Promise.all([
      initCards(),
      initUsers(),
      initGameStatuses(),
      initPoliticalRanks()
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
      dropGameConfigurations(),
      dropPoliticalRanks()
    ]);
    await db.close();
  });

  it('Verify init() creates 1 presidents game document', async function() {  
    await init();  
    const docs = await PresidentsGame.find({});
    docs[0].config.deck=[]
    console.log(JSON.stringify(docs[0], null, 2))
    expect(docs.length).toBe(1);
  });

  it('Verify drop() deletes all presidents game documents', async function() {    
    await drop();
    const docs = await Game.find({});
    expect(docs.length).toBe(0);
  });

});



const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}



module.exports = { init, drop, test };