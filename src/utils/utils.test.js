const Utils = require('./');
const Card = require('../models/Card');

module.exports = describe('Utility Tests', async function() {

  before(async function() {
  });

  after(async function() {
  });



  describe('shuffle(deck)', async function() {

    it('Shuffles 52 card object ids', async function() {

    });

  });
 

  describe('deal(numPlayers=4, shuffledDeck)', async function() {

    it('Creates a an array of length numPlayers each containing 13 cards', async function() {

    });

  });

  describe('sort(cards)', async function() {

    it('Sorts an array of cards by rank', async function() {
      // extract the first four items
      // check if they are equal to v, continue until v = 14 (Ace)
      // let v = 2;
      // while (v < 15) {
      //   let chunk = ranks.splice(0, 4);
      //   for (let peice of chunk) {
      //     expect(peice).toBe(v);
      //   }
      //   v++;
      // }
    });

  });

  describe('find3Clubs(allPlayerHands)', async function() {

    it('Searchs through a 2d array cards, returns index of array with 3♣', async function() {

    });

    it('Throws exception if 2d array does not contain 3♣', async function() {
      const arr = [[{}],[{}],[{}]];
      assert.throws(() => Utils.find3Clubs(arr), Error, '4 of Clubs was not in the deck.');
    });

  });
  
  describe('#calculateSkips()', async function() {   

    it('single skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const cards = await Card.find({shortHand: 'AHearts'});
      const skips = Utils.calculateSkips(handToBeat, cards);
      expect(skips).toBe(1);
    });

    it('double skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const aceHearts = await Card.findOne({shortHand: 'AHearts'});
      const aceDiamonds = await Card.findOne({shortHand: 'ADiamonds'});
      const cards = [aceHearts, aceDiamonds];
      const skips = Utils.calculateSkips(handToBeat, cards);
      expect(skips).toBe(2);
    });

    it('triple skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const aceHearts = await Card.findOne({shortHand: 'AHearts'});
      const aceDiamonds = await Card.findOne({shortHand: 'ADiamonds'});
      const aceClubs = await Card.findOne({shortHand: 'AClubs'});
      const cards = [aceHearts, aceDiamonds, aceClubs];
      const skips = Utils.calculateSkips(handToBeat, cards);
      expect(skips).toBe(3);
    });
  
    it('no skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const cards = await Card.find({shortHand: '2Hearts'});
      const skips = Utils.calculateSkips(handToBeat, cards);
      expect(skips).toBe(0);
    });

  });
  
});