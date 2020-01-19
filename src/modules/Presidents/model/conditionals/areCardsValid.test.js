const Card = require('../../');
const Presidents = require('..');
const expect = require('expect');

module.exports = async () => describe('#areCardsValid()', async function() {   

  before(async function() {
    this.threeClubs = await Card.findOne({shortHand: '3Clubs'});
    this.threeHearts = await Card.findOne({shortHand: '3Hearts'});
    this.fourHearts = await Card.findOne({shortHand: '4Hearts'});
  });

  describe('true', async function () {
  
    it('cards are of the same rank', async function() {  
      const cards = [this.threeClubs, this.threeHearts];
      let valid = Presidents.areCardsValid(cards);
      expect(valid).toBeTruthy();
    });

  });

  describe('false', async function () {
  
    it('cards are not of the same rank', async function() {  
      const cards = [this.threeClubs, this.fourHearts];
      let valid = Presidents.areCardsValid(cards);
      expect(valid).toBeFalsy();
    });

  });

});
