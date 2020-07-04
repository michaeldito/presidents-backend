const Card = require('../../../Card/model');
const Presidents = require('../');
const expect = require('expect');

module.exports = async () => describe('#calculateSkips()', async function() {   

    it('single skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const cards = await Card.find({shortHand: 'AHearts'});
      const skips = Presidents.calculateSkips(handToBeat, cards);
      expect(skips).toBe(1);
    });

    it('double skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const aceHearts = await Card.findOne({shortHand: 'AHearts'});
      const aceDiamonds = await Card.findOne({shortHand: 'ADiamonds'});
      const cards = [aceHearts, aceDiamonds];
      const skips = Presidents.calculateSkips(handToBeat, cards);
      expect(skips).toBe(2);
    });

    it('triple skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const aceHearts = await Card.findOne({shortHand: 'AHearts'});
      const aceDiamonds = await Card.findOne({shortHand: 'ADiamonds'});
      const aceClubs = await Card.findOne({shortHand: 'AClubs'});
      const cards = [aceHearts, aceDiamonds, aceClubs];
      const skips = Presidents.calculateSkips(handToBeat, cards);
      expect(skips).toBe(3);
    });
  
    it('no skip', async function() {  
      const handToBeat = await Card.find({shortHand: 'ASpades'});
      const cards = await Card.find({shortHand: '2Hearts'});
      const skips = Presidents.calculateSkips(handToBeat, cards);
      expect(skips).toBe(0);
    });


});
