const { 
  GameStatus,
  Presidents,
  GameConfiguration,
  User,
  Card,
  PoliticalRank
} = require('../..');
const mongoose = require('mongoose');
const expect = require('expect');


module.exports = async () => describe('#initializeNextRound()', async function() {   
  
  
  before(async function() {
    const status = await GameStatus.findByValue('FINALIZED');
    const config = await GameConfiguration.findOne({name: 'Presidents'});
    const currentPlayer = await User.findByUsername('tommypastrami');
    const createdBy = currentPlayer;
    const hand = await Card.find({}).limit(5);
    const user = currentPlayer;
    const name = 'next round prez game';
    const rules = {
      doubleSkips: false,
      scumStarts: false,
      scumHandsTwo: false,
      oneEyedJacksAndKingOfHearts: false,
      reversePresidentScumTrade: false,
      presidentDeals: false,
      goLow: false,
      equalNumber: false,
      noEndOnBomb: false,
      tripleSixes: false,
      passOut: false,
      fourInARow: false,
      larryPresidents: true
    };
    const winner = user;
    const politicalRank = await PoliticalRank.findByName('President');
    const nextGameRank = politicalRank;
    const drinksDrunk = 0;
    const drinksReceived = [{ createdAt: new Date(), sentBy: user }];
    const drinksSent = [{ createdAt: new Date(), sentTo: user }];
    const player = {
      user,
      joinedAt: new Date(),
      seatPosition: 1,
      hand,
      politicalRank,
      nextGameRank,
      drinksDrunk,
      drinksReceived,
      drinksSent
    };

    const game = {
      winner,
      createdBy,
      name,
      status,
      config,
      rules,
      currentPlayer,
      rounds: [],
      players: [player,player]
    };
  
    await Presidents.create(game);
  });

  describe('validations', async function () {

    it('cannot start next round if game status is finalized', async function() {  
      let doc = await Presidents.findOne({name: 'next round prez game'});
      const message = 'Unable to start next round. The game is finalized.';

      try {
        await doc.initializeNextRound();
      } catch(err) {
        expect(err.message).toBe(message);
      }
    });

  });

  describe('successful', async function () {

    it('should have added a new round and with a startedAt date', async function() { 
      let doc = await Presidents.findOne({name: 'next round prez game'});
      doc.status = await GameStatus.findByValue('NOT_STARTED');
      await doc.save();

      try {
        doc = await Presidents.findOne({name: 'next round prez game'});
        await doc.initializeNextRound();
        doc = await Presidents.findOne({name: 'next round prez game'});
        expect(doc.rounds.length).toBe(1);
        expect(doc.rounds[0].startedAt).toBeTruthy();
      } catch(err) { 
        expect(err).toBeFalsy();
      }

    });

    it('should set game status to in progress if this is round one', async function() { 
      let doc = await Presidents.findOne({name: 'next round prez game'});
      expect(doc.status.value).toBe('IN_PROGRESS');
    });

  });

});
