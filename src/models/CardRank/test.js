const CardRank = require('.');
const { cardRanks } = require('./data');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = cardRanks.map(cardRank => new CardRank(cardRank));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await CardRank.deleteMany({});
}

const test = async () => describe('CardRank', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 13 documents', async function() {    
    await init();
    const docs = await CardRank.find({});
    expect(docs.length).toBe(13);
  });
    
  it('Verify findByChar(char) returns correct card rank document', async function() {    
    const doc = await CardRank.findByChar('A');
    expect(doc.character).toBe('A');
  });

  it('Verify drop() deletes all card rank documents', async function() {    
    await drop();
    const docs = await CardRank.find({});
    expect(docs.length).toBe(0);
  });

  describe('Validations', function() {    

    it('name is required', function() {
      const cardRank = {
        character: '3',
        value: 3
      };
      const instance = new CardRank(cardRank);
      const error = instance.validateSync();
      const message = 'A name is required for every card rank.';

      expect(error.errors['name'].message).toBe(message);
    });

    it('character is required', function() {    
      const cardRank = {
        name: 'Jack',
        value: 11
      };
      const instance = new CardRank(cardRank);
      const error = instance.validateSync();
      const message = 'A character is required for every card rank.';

      expect(error.errors['character'].message).toBe(message);
    });

    it('value is required', function() {    
      const cardRank = {
        name: 'Jack',
        character: 'J'
      };
      const instance = new CardRank(cardRank);
      const error = instance.validateSync();
      const message = 'A value is required for every card rank.';
      
      expect(error.errors['value'].message).toBe(message);
    });
    
  });
  
});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  // test();
}



module.exports = { init, drop, test };