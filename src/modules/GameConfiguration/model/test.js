const { init: initCardRanks, drop: dropCardRanks } = require('../../../modules/CardRank/model/test');
const { init: initSuits, drop: dropSuits } = require('../../../modules/Suit/model/test');
const { init: initCards, drop: dropCards } = require('../../../modules/Card/model/test');
const { gameConfigurations } = require('./data');

const GameConfiguration = require('./');
const Card = require('../../../modules/Card/model');
const CardRank = require('../../../modules/CardRank/model');

const db = require('../../../config/db');
const expect = require('expect');



const init = async () => {
  const count = await GameConfiguration.countDocuments({});
  if (count === 3) 
    return Promise.resolve();
    
  let deck = await Card.getDeck();
  let configs = gameConfigurations.map(config => ({...config, deck}));
  let instances = configs.map(config => new GameConfiguration(config));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await GameConfiguration.deleteMany({});
}

const test = async () => describe('GameConfiguration', async function() {
    
  before(async function() {
    await db.connect();
    await initCardRanks();
    await initSuits();
    await initCards();
  });

  after(async function() {
    await dropCards();
    await dropCardRanks();
    await dropSuits();
    await db.close();
  });

  describe('#init()', async function() {    

    it('verify it initializes 3 game configuration documents', async function() {    
      await init();
      const docs = await GameConfiguration.find({});
      expect(docs.length).toBe(3);
    });

    describe('validations', async function() {    

      it('name is required', async function() {
        const card = await Card.findOne({});
        const config = {
          maxPlayers: 1,
          deck: [card],
          numDecks: 1
        };
        const instance = new GameConfiguration(config);
        const error = instance.validateSync();
        const message = 'A name is required for every game configuration.';
  
        expect(error.errors['name'].message).toBe(message);
      });
  
      it('name must be unique', async function() {
        const card = await Card.findOne({});
        const config = {
          name: 'Presidents',
          maxPlayers: 1,
          deck: [card],
          numDecks: 1
        };
        const instance = new GameConfiguration(config);
        const message = 'Error, expected `name` to be unique. Value: `Presidents`';
        
        instance.save(error => {
          expect(error.errors['name'].message).toBe(message);
        });
      });
  
      it('maxPlayers is required', async function() {    
        const card = await Card.findOne({});
        const config = {
          name: 'name',
          deck: [card],
          numDecks: 1
        };
        const instance = new GameConfiguration(config);
        const error = instance.validateSync();
        const message = 'A maxPlayers field is required for every game configuration.';
  
        expect(error.errors['maxPlayers'].message).toBe(message);
      });

      it.skip('maxPlayers must be >= minPlayers', async function() {    
        
      });

      it.skip('minPlayers must be <= maxPlayers', async function() {    
        
      });
  
      it('deck must not be empty', async function() {     
        const config = {
          name: 'name',
          maxPlayers: 1,
          numDecks: 1,
          deck: []
        };
        const instance = new GameConfiguration(config);
        const message = 'empty deck';
        instance.validate(error => {
          expect(error.errors['deck'].reason.message).toBe(message);
        });
  
      });
  
      it('deck must be array of Card instances', async function() {   
        const rank = await CardRank.findOne({});
        const card = await Card.findOne({});
        const config = {
          name: 'name',
          maxPlayers: 1,
          numDecks: 1,
          deck: [rank, card]
        };
        const instance = new GameConfiguration(config);
        const message = 'objectId does not reference a card';
        instance.validate(error => {
          expect(error.errors['deck'].reason.message).toBe(message);
        });
  
      });
      
      it('numDecks is required', async function() {  
        const card = await Card.findOne({});  
        const config = {
          name: 'name',
          maxPlayers: 1,
          deck: [card]
        };
        const instance = new GameConfiguration(config);
        const error = instance.validateSync();
        const message = 'A numDecks field is required for every game configuration.';
        
        expect(error.errors['numDecks'].message).toBe(message);
      });
      
    });

  });

  describe('#drop()', async function() { 

    it('verify it deletes all game configuration documents', async function() {    
      await drop();
      const docs = await GameConfiguration.find({});
      expect(docs.length).toBe(0);
    });   

  });

});

module.exports = { init, drop, test};