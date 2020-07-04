const Presidents = require('../');
const Card = require('../../../Card/model');
const expect = require('expect');

module.exports = async () => describe('#areCardsBetter()', async function() {   

  describe('true', async function () {

    it('current hand has more cards', async function() {
      const handToBeat = await Card.find({shortHand: '4Diamonds'});
      const threeHearts = await Card.findOne({shortHand: '4Hearts'});
      const threeSpades = await Card.findOne({shortHand: '4Spades'});
      const cards = [threeHearts, threeSpades];

      let isTurnBetter;

      try {
        isTurnBetter = await Presidents.areCardsBetter(handToBeat, cards);
      } catch (err) { }

      expect(isTurnBetter).toBeTruthy();
    });

    it('current hand has equal number of cards with same rank', async function() {  
      const handToBeat = await Card.find({shortHand: '4Diamonds'});
      const cards = await Card.find({shortHand: '4Hearts'});

      let isTurnBetter;

      try {
        isTurnBetter = await Presidents.areCardsBetter(handToBeat, cards);
      } catch (err) { }

      expect(isTurnBetter).toBeTruthy();
    });

    it('current hand has equal number of cards with a better rank', async function() {  
      const handToBeat = await Card.find({shortHand: '4Diamonds'});
      const cards = await Card.find({shortHand: '5Hearts'});

      let isTurnBetter;

      try {
        isTurnBetter = await Presidents.areCardsBetter(handToBeat, cards);
      } catch (err) { }

      expect(isTurnBetter).toBeTruthy();
    });

    it('current hand has fewer cards but contains a two', async function() {  
      const fourDiamonds = await Card.findOne({shortHand: '4Diamonds'});
      const fourHearts = await Card.findOne({shortHand: '4Hearts'});
      const handToBeat = [fourDiamonds, fourHearts];
      const cards = await Card.find({shortHand: '2Hearts'});

      let isTurnBetter;

      try {
        isTurnBetter = await Presidents.areCardsBetter(handToBeat, cards);
      } catch (err) { }

      expect(isTurnBetter).toBeTruthy();
    });

  });

  describe('false', async function () {

    it('current turn\'s rank does not beat previous turns rank', async function() {  
      const handToBeat = await Card.find({shortHand: '4Hearts'});
      const cards = await Card.find({shortHand: '3Hearts'});

      let isTurnBetter;

      try {
        isTurnBetter = await Presidents.areCardsBetter(handToBeat, cards);
      } catch (err) { 
        expect(err.message).toBe(`The rank of the selected cards does not beat the previous turns.`);
      }
    });

    it('not enough cards selected (not a 2)', async function() {  
      const fourHearts = await Card.findOne({shortHand: '4Hearts'});
      const fourSpades = await Card.findOne({shortHand: '4Spades'});
      const handToBeat = [fourHearts, fourSpades];
      const cards = await Card.find({shortHand: '5Hearts'});

      let isTurnBetter;

      try {
        isTurnBetter = await Presidents.areCardsBetter(handToBeat, cards);
      } catch (err) { 
        expect(err.message).toBe(`The selected cards contain fewer cards than the previous turn, and does not contain a two.`);
      }
    });


  });


});
