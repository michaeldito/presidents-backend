const { PlayerModel, GameModel, UserModel, GameStateModel,
  CardModel, SuitModel, CardRankModel } = require('../src/models');
const utils = require('../src/utils');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const assert = require('assert');
require('dotenv').config();


describe('Utility Tests', () => {

  before(async () => {
    const options = { useNewUrlParser: true, useCreateIndex: true };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
  });

  after(async () => {
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});

    await mongoose.connection.close();
  });



  describe('Populate DB with cards', () => {    
    
    before(async () => {
      await CardModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await SuitModel.deleteMany({});
    });

    describe('Verify Card Initialization', () => {

      it('52 Cards are in the DB', async () => {
        await init.initCards();
        const count = await CardModel.countDocuments({});
        expect(count).toBe(52);
      });

    });

  });


  describe('shuffle(deck)', () => {

    it('Shuffles 52 card object ids', async () => {
      const deck = await CardModel.find({});
      const shuffled = utils.shuffle(deck);

      expect(shuffled.length).toBe(52);
      
      // how to test the shuffle? 
      // lets grab a few indexes and hope they dont match i guess
      expect(deck[0]).not.toEqual(shuffled[0]);
      expect(deck[25]).not.toEqual(shuffled[25]);
      expect(deck[51]).not.toEqual(shuffled[51]);
    });

  });
 

  describe('deal(numPlayers=4, shuffledDeck)', () => {

    it('Creates a an array of length numPlayers each containing 13 cards', async () => {
      const deck = await CardModel.find({});
      const shuffled = utils.shuffle(deck);
      const numPlayers = 4;
      const playerHands = utils.deal(numPlayers, shuffled);

      expect(playerHands).toHaveLength(4);
      playerHands.forEach(hand => expect(hand).toHaveLength(13));
    });

  });


});