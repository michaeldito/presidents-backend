const { CardModel, CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, DeckModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const assert = require('assert');
require('dotenv').config();

describe('MongoDB Init Tests', function() {

  before(async function() {
    const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
    await init.dropAll();
  });

  after(async function() {
    await init.dropAll();
    await mongoose.connection.close();
  });

  describe('Check that db collections are empty.', function() {

    it('No Card Ranks in DB', async function() {
      const count = await CardRankModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('No Suits in DB', async function() {
      const count = await SuitModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('No Cards in DB', async function() {
      const count = await CardModel.countDocuments({});
      expect(count).toBe(0);
    });

  });

  describe('Verify DB Initialization', function() {
    
    before(async function() {
      await init.initPresidents();
    });

    it('1 Deck is in the DB', async function() {
      const count = await DeckModel.countDocuments({});
      expect(count).toBe(1);
    });

    it('52 Cards are in the DB', async function() {
      const count = await CardModel.countDocuments({});
      expect(count).toBe(52);
    });

    it('4 Suits are in the DB', async function() {
      const count = await SuitModel.countDocuments({});
      expect(count).toBe(4);
    });

    it('13 Ranks are in the DB', async function() {
      const count = await CardRankModel.countDocuments({});
      expect(count).toBe(13);
    });

    it('9 Political Ranks are in the DB', async function() {
      const count = await PoliticalRankModel.countDocuments({});
      expect(count).toBe(9);
    });

    it('9 Users are in the DB', async function() {
      const count = await UserModel.countDocuments({});
      expect(count).toBe(9);
    });

    it('9 Players are in the DB', async function() {
      const count = await PlayerModel.countDocuments({});
      expect(count).toBe(9);
    });

  });

  describe('Verify calling init() twice does not create duplicates.', function() {
    
    it('should throw duplicate init error', async function() {
      assert.rejects(init.initPresidents(), Error, 'Unable to init Presidents. Already initialized.');
    });

    it('1 Deck is in the DB', async function() {
      const count = await DeckModel.countDocuments({});
      expect(count).toBe(1);
    });

    it('52 Cards are in the DB', async function() {
      const count = await CardModel.countDocuments({});
      expect(count).toBe(52);
    });

    it('4 Suits are in the DB', async function() {
      const count = await SuitModel.countDocuments({});
      expect(count).toBe(4);
    });

    it('13 Ranks are in the DB', async function() {
      const count = await CardRankModel.countDocuments({});
      expect(count).toBe(13);
    });

    it('9 Political Ranks are in the DB', async function() {
      const count = await PoliticalRankModel.countDocuments({});
      expect(count).toBe(9);
    });

    it('9 Users are in the DB', async function() {
      const count = await UserModel.countDocuments({});
      expect(count).toBe(9);
    });

    it('9 Players are in the DB', async function() {
      const count = await PlayerModel.countDocuments({});
      expect(count).toBe(9);
    });

  });


  describe('Verify dropAll() drops all', function() {
    
    before(async function() {
      await init.dropAll();
    })

    it('0 Decks are in the DB', async function() {
      const count = await DeckModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('0 Cards are in the DB', async function() {
      const count = await CardModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('0 Suits are in the DB', async function() {
      const count = await SuitModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('0 Ranks are in the DB', async function() {
      const count = await CardRankModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('0 Political Ranks are in the DB', async function() {
      const count = await PoliticalRankModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('0 Users are in the DB', async function() {
      const count = await UserModel.countDocuments({});
      expect(count).toBe(0);
    });

    it('0 Players are in the DB', async function() {
      const count = await PlayerModel.countDocuments({});
      expect(count).toBe(0);
    });

  });


});