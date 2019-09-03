const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const { init: initCards, drop: dropCards } = require('../Card/test');
const { gameConfigurations } = require('./data');
const GameConfiguration = require('./');
const Card = require('../Card');
const db = require('../../config/db');
const expect = require('expect');



const init = async () => {
  let deck = await Card.getDeck();
  let configs = gameConfigurations.map(config => ({...config, deck}));
  let instances = configs.map(config => new GameConfiguration(config));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

const drop = async () => {
  await GameConfiguration.deleteMany({});
}

const test = async () => describe('GameConfiguration', function() {
    
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

  it('Verify init() initializes 3 game configuration documents', async function() {    
    await init();
    const docs = await GameConfiguration.find({});
    expect(docs.length).toBe(3);
  });


  it('Verify drop() deletes all game configuration documents', async function() {    
    await drop();
    const docs = await GameConfiguration.find({});
    expect(docs.length).toBe(0);
  });

  describe('Validations', async function() {    

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

    it('deck is required', function() {    
      const config = {
        name: 'name',
        maxPlayers: 1,
        numDecks: 1
      };
      const instance = new GameConfiguration(config);
      const error = instance.validateSync();
      const message = 'A deck cannot be empty or have non ObjectId values.';

      expect(error.errors['deck'].message).toBe(message);
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


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  test();
}

module.exports = { init, drop, test};