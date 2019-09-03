const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const CardRank = require('../CardRank');
const Suit = require('../Suit');
const Card = require('./');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const suits = await Suit.find({});
  const cardRanks = await CardRank.find({});

  let cards = [];

  for (suit of suits) {
    for (cardRank of cardRanks) {
      const shortHand = cardRank.character + suit.name;
      cards.push({ cardRank, suit, shortHand });
    }
  }

  let cardInstances = cards.map(card => new Card(card));
  let cardPromises = cardInstances.map(instance => instance.save());

  await Promise.all(cardPromises);
}

const drop = async () => {
  await Card.deleteMany({});
}

const test = async () => describe('Card', function() {
    
  before(async function() {
    await db.connect();
    await initSuits();
    await initCardRanks();
  });

  after(async function() {
    await dropCardRanks();
    await dropSuits();
    await db.close();
  });

  it('Verify init() initializes 52 card documents', async function() {    
    await init();
    const docs = await Card.find({});
    expect(docs.length).toBe(52);
  });
    
  it('Verify getDeck() returns 52 card documents', async function() {    
    const deck = await Card.getDeck();
    expect(deck.length).toBe(52);
  });

  it('Verify drop() deletes all card documents', async function() { 
    await drop();   
    const docs = await Card.find({});
    expect(docs.length).toBe(0);
  });

  describe('Validations', async function() {    

    it('shortHand is required', async function() {
      const cardRank = await CardRank.findOne({});
      const suit = await Suit.findOne({});
      const card = { cardRank, suit };
      const instance = new Card(card);
      const error = instance.validateSync();
      const message = 'A shorthand is required for every card.';

      expect(error.errors['shortHand'].message).toBe(message);
    });

    it('cardRank is required', async function() {    
      const shortHand = 'shortHand';
      const suit = await Suit.findOne({});
      const card = { shortHand, suit };
      const instance = new Card(card);
      const error = instance.validateSync();
      const message = 'A card rank is required for every card.';

      expect(error.errors['cardRank'].message).toBe(message);
    });

    it('suit is required', async function() {    
      const shortHand = 'shortHand';
      const cardRank = await CardRank.findOne({});
      const card = { shortHand, cardRank };
      const instance = new Card(card);
      const error = instance.validateSync();
      const message = 'A suit is required for every card.';
      
      expect(error.errors['suit'].message).toBe(message);
    });
    
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  // test();
}



module.exports = { init, drop, test};