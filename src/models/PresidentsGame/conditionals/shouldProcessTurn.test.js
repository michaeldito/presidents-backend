const { Card, PresidentsGame } = require('../..');
const expect = require('expect');
const mongoose = require('mongoose');

module.exports = async () => describe('#shouldProcessTurn()', async function() {   

  describe('true', async function () {

    it('current hand is better', async function() {
      const userId = mongoose.Types.ObjectId();
      const currentPlayer = userId;
      const sevenHearts = await Card.find({shortHand: '7Hearts'});
      const turn = {
        user: userId,
        cardsPlayed: sevenHearts
      };
      const handToBeat = await Card.find({shortHand: '5Hearts'});
      let shouldProcessTurn;
      try {
        shouldProcessTurn = await PresidentsGame.shouldProcessTurn(currentPlayer, handToBeat, turn);
      } catch (err) {
        console.log(err);
      }
      expect(shouldProcessTurn).toBeTruthy();
    });


  });

  describe('false', async function () {

    it('not your turn', async function() {  
      const userId = mongoose.Types.ObjectId();
      const currentPlayer = userId;
      const sevenHearts = await Card.find({shortHand: '7Hearts'});
      const turn = {
        user: mongoose.Types.ObjectId(),
        cardsPlayed: sevenHearts
      };
      const handToBeat = await Card.find({shortHand: '5Hearts'});
      let shouldProcessTurn;
      try {
        shouldProcessTurn = await PresidentsGame.shouldProcessTurn(currentPlayer, handToBeat, turn);
      } catch (err) {
        expect(err.message).toBe(`Unable to process turn. It is not your turn.`);
      }
    });

    it('invalid cards', async function() {  
      const userId = mongoose.Types.ObjectId();
      const currentPlayer = userId;
      const sevenHearts = await Card.findOne({shortHand: '7Hearts'});
      const eightHearts = await Card.findOne({shortHand: '8Hearts'});
      const turn = {
        user: userId,
        cardsPlayed: [sevenHearts, eightHearts]
      };
      const handToBeat = await Card.find({shortHand: '5Hearts'});
      let shouldProcessTurn;
      try {
        shouldProcessTurn = await PresidentsGame.shouldProcessTurn(currentPlayer, handToBeat, turn);
      } catch (err) {
        expect(err.message).toBe(`Unable to process turn. The cards selected are invalid.`);
      }
    });

    it('cards are not better', async function() {  
      const userId = mongoose.Types.ObjectId();
      const currentPlayer = userId;
      const sevenHearts = await Card.findOne({shortHand: '7Hearts'});
      const eightHearts = await Card.findOne({shortHand: '8Hearts'});
      const turn = {
        user: userId,
        cardsPlayed: [sevenHearts]
      };
      const handToBeat = [eightHearts];
      let shouldProcessTurn;
      try {
        shouldProcessTurn = await PresidentsGame.shouldProcessTurn(currentPlayer, handToBeat, turn);
      } catch (err) {
        expect(err.message).toBe(`Unable to process turn. The selected cards are not better. The rank of the selected cards does not beat the previous turns.`);
      }
    });

  });


});
