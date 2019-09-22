const Card = require('../../Card');
const PresidentsGame = require('../');
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
      let valid;
      try {
        valid = await PresidentsGame.areCardsValid(cards);
      } catch (err) { }
      expect(valid).toBeTruthy();
    });

  });

  describe('false', async function () {
  
    it('cards are not of the same rank', async function() {  
      const cards = [this.threeClubs, this.fourHearts];
      let valid;
      try {
        valid = await PresidentsGame.areCardsValid(cards);
      } catch (err) { 
        expect(err.message).toBe('cards are not valid');
      }
    });

  });

});
