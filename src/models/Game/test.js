const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initCards, drop: dropCards } = require('../Card/test');
const { init: initGameStatuses, drop: dropGameStatuses } = require('../GameStatus/test');
const { init: initGameConfigurations, drop: dropGameConfigurations } = require('../GameConfiguration/test');

const GameStatus = require('../GameStatus');
const GameConfiguration = require('../GameConfiguration');
const User = require('../User');
const Game = require('./');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const status = await GameStatus.findByStatus('NOT_STARTED');
  const config = await GameConfiguration.findOne({name: 'test-game'});
  const currentPlayer = await User.findByUsername('tommypastrami');
  const name = 'test game';
  const game = { name, status, config, currentPlayer };

  await Game.create(game);
}

const drop = async () => {
  await Game.deleteMany({});
}

const test = async () => describe('Game', function() {
    
  before(async function() {
    await db.connect();
    await initCards();
    await Promise.all([
      initUsers(),
      initGameStatuses(),
      initGameConfigurations()
    ]);
  });

  after(async function() {
    await Promise.all([
      dropCards(),
      dropUsers(),
      dropGameStatuses(),
      dropGameConfigurations(),
    ]);
    await db.close();
  });

  it('Verify init() creates 1 game document', async function() {  
    await init();  
    const docs = await Game.find({});
    expect(docs.length).toBe(1);
  });

  it('Verify drop() deletes all game documents', async function() {    
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