const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
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
  const count = await Game.countDocuments({});
  if (count === 1) 
    return Promise.resolve();

  const status = await GameStatus.findByValue('NOT_STARTED');
  const config = await GameConfiguration.findOne({name: 'test-game'});
  const currentPlayer = await User.findByUsername('tommypastrami');
  const createdBy = currentPlayer;
  const name = 'test game';
  const game = { name, createdBy, currentPlayer, status, config, currentPlayer };

  await Game.create(game);
}

const drop = async () => {
  await Game.deleteMany({});
}

const test = async () => describe('Game', async function() {
    
  before(async function() {
    this.timeout(20000);
    await db.connect();
    await initCardRanks();
    await initSuits();
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
      dropSuits(),
      dropCardRanks(),
      dropUsers(),
      dropGameStatuses(),
      dropGameConfigurations(),
    ]);
    await db.close();
  });

  describe('#init()', async function() {    

    it('verify it creates 1 game document', async function() {  
      await init();  
      const docs = await Game.find({});
      //console.log(docs)
      expect(docs.length).toBe(1);
    });

    describe('validations', async function() { 

      before(async function() {
        const status = await GameStatus.findByValue('NOT_STARTED');
        const config = await GameConfiguration.findOne({name: 'test-game'});
        const currentPlayer = await User.findByUsername('tommypastrami');
        const createdBy = currentPlayer;
        const name = 'test game init validations';
        this.game = { name, createdBy, currentPlayer, status, config, currentPlayer };  
      });
      
      it('name is required', async function() {
        const { name, ...rest } = this.game;
        const g1 = rest;
        const instance = new Game(g1);
        const error = instance.validateSync();
        const message = 'A name is required to create a game.';
        
        expect(error.errors['name'].message).toBe(message);
      });

      it('name must be unique', async function() {
        const { name, ...rest } = this.game;
        const g1 = rest;
        g1.name = 'test game'; // used above in init
        const instance = new Game(g1);
        const message = 'Error, expected `name` to be unique. Value: `test game`';
        
        instance.save(error => {
          expect(error.errors['name'].message).toBe(message);
        });
      });

      it('status is required', async function() {    
        const { status, ...rest } = this.game;
        const g1 = rest;
        const instance = new Game(g1);
        const error = instance.validateSync();
        const message = 'A status is required to create a game.';
        
        expect(error.errors['status'].message).toBe(message);
      });

      it('config is required', async function() {    
        const { config, ...rest } = this.game;
        const g1 = rest;
        const instance = new Game(g1);
        const error = instance.validateSync();
        const message = 'A config is required to create a game.';
        
        expect(error.errors['config'].message).toBe(message);
      });
      
      it('createdBy is required', async function() {    
        const { createdBy, ...rest } = this.game;
        const g1 = rest;
        const instance = new Game(g1);
        const error = instance.validateSync();
        const message = 'A createdBy is required to create a game.';
        
        expect(error.errors['createdBy'].message).toBe(message);
      });
      
    });

  });

  describe('#drop()', async function() {    

    it('verify it deletes all game documents', async function() {    
      await drop();
      const docs = await Game.find({});
      expect(docs.length).toBe(0);
    });

  });

});


module.exports = { init, drop, test };