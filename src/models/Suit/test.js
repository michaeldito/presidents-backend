const Suit = require('./');
const { suits } = require('./data');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = suits.map(suit => new Suit(suit));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await Suit.deleteMany({});
}

const test = async () => describe('Suit', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 4 suit documents', async function() {    
    await init();
    const docs = await Suit.find({});
    expect(docs.length).toBe(4);
  });
    
  it('Verify findByName(name) returns correct suit document', async function() {    
    let doc = await Suit.findByName('Hearts');
    expect(doc.name).toBe('Hearts');
    doc = await Suit.findByName('Spades');
    expect(doc.name).toBe('Spades');
    doc = await Suit.findByName('Diamonds');
    expect(doc.name).toBe('Diamonds');
    doc = await Suit.findByName('Clubs');
    expect(doc.name).toBe('Clubs');
  });

  it('Verify drop() deletes all documents', async function() {    
    await drop();
    const docs = await Suit.find({});
    expect(docs.length).toBe(0);
  });

  describe('Validations', function() {    

    it('name is required', function() {
      const suit = {
        color: 'Black',
        character: '\u2663',
        value: 0
      };
      const instance = new Suit(suit);
      const error = instance.validateSync();
      const message = 'A name is required for every suit.';

      expect(error.errors['name'].message).toBe(message);
    });

    it('color is required', function() {    
      const suit = {
        name: 'Clubs',
        character: '\u2663',
        value: 0
      };
      const instance = new Suit(suit);
      const error = instance.validateSync();
      const message = 'A color is required for every suit.';

      expect(error.errors['color'].message).toBe(message);
    });

    it('character is required', function() {    
      const suit = {
        name: 'Clubs',
        color: 'Black',
        value: 0
      };
      const instance = new Suit(suit);
      const error = instance.validateSync();
      const message = 'A character is required for every suit.';
      
      expect(error.errors['character'].message).toBe(message);
    });
    
    it('value is required', async function() {    
      const suit = {
        name: 'Clubs',
        color: 'Black',
        character: '\u2663'
      };
      const instance = new Suit(suit);
      const error = instance.validateSync();
      const message = 'A value is required for every suit.';
      
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