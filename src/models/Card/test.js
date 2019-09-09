const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const CardRank = require('../CardRank');
const Suit = require('../Suit');
const Card = require('./');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const count = await Card.countDocuments({});
  if (count === 52) 
    return Promise.resolve();

  const suits = await Suit.find({});
  if (suits.length !== 4)
    return Promise.reject(new Error('Suits not initialized. Cannot create cards.'));

  const cardRanks = await CardRank.find({});
  if (cardRanks.length !== 13)
    return Promise.reject(new Error('CardRanks not initialized. Cannot create cards.'));

  let cards = [];

  for (suit of suits) {
    for (cardRank of cardRanks) {
      const shortHand = cardRank.character + suit.name;
      cards.push({ cardRank, suit, shortHand });
    }
  }

  let instances = cards.map(card => new Card(card));
  let promises = instances.map(instance => instance.save());

  await Promise.all(promises);
}

const drop = async () => {
  await Card.deleteMany({});
}

const test = async () => describe('Card', async function() {
    
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

  describe('#init()', async function() {    

    it('verify it initializes 52 card documents', async function() {    
      await init();
      const docs = await Card.find({});
      expect(docs.length).toBe(52);
    });

    describe('validations', async function() {    

      it('shortHand is required', async function() {
        const cardRank = await CardRank.findOne({});
        const suit = await Suit.findOne({});
        const card = { cardRank, suit };
        const instance = new Card(card);
        const error = instance.validateSync();
        const message = 'A shorthand is required for every card.';

        expect(error.errors['shortHand'].message).toBe(message);
      });

      it('shortHand must be unique', async function() {
        const { shortHand, cardRank, suit } = await Card.findOne({shortHand: '3Clubs'});
        const card = { shortHand, cardRank, suit };
        const instance = new Card(card);
        const message = 'Error, expected `shortHand` to be unique. Value: `3Clubs`';
        
        instance.save(error => {
          expect(error.errors['shortHand'].message).toBe(message);
        });
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

  describe('#getDeck()', async function() {    

    it('verify getDeck() returns 52 card documents', async function() {    
      const deck = await Card.getDeck();
      expect(deck.length).toBe(52);
    });

  });

  describe('#drop()', async function() {    

    it('verify drop() deletes all card documents', async function() { 
      await drop();   
      const docs = await Card.find({});
      expect(docs.length).toBe(0);
    });

  });

});

module.exports = { init, drop, test};