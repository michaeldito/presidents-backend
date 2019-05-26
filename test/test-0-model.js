const { CardModel, CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, GameModel,
  GameStateModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
require('dotenv').config();

describe('Mongoose Model Tests', () => {

  before(async () => {
    const options = { useNewUrlParser: true, useCreateIndex: true };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
  });

  after(async () => {
    await mongoose.connection.close();
  });



  describe('CardRank, Suit, and Card Model Tests', () => {    
    
    before(async () => {
      await CardModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await SuitModel.deleteMany({});
    });

    after(async () => {
      await CardModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await SuitModel.deleteMany({});
    });

    describe('Check that db collections are empty.', () => {

      it('No Card Ranks in DB', async () => {
        const count = await CardRankModel.countDocuments({});
        expect(count).toBe(0);
      });

      it('No Suits in DB', async () => {
        const count = await SuitModel.countDocuments({});
        expect(count).toBe(0);
      });

      it('No Cards in DB', async () => {
        const count = await CardModel.countDocuments({});
        expect(count).toBe(0);
      });

    });

    describe('Verify Card Initialization', () => {

      it('52 Cards are in the DB', async () => {
        await init.initCards();
        const count = await CardModel.countDocuments({});
        expect(count).toBe(52);
      });

      it('Calling initialize twice doesn\'t create duplicate instances', async () => {
        await init.initCards();
        const count = await CardModel.countDocuments({});
        expect(count).toBe(52);
      });

    });

  });



  describe('Political Rank Tests', () => {
    
    before(async () => {
      await PoliticalRankModel.deleteMany({});
    });

    describe('Check that db collections are empty', () => {

      it('No Political Ranks in DB', async () => {
        const count = await PoliticalRankModel.countDocuments({});
        expect(count).toBe(0);
      });

    });

    describe('Verify Political Rank Initialization', () => {

      it('8 Political Ranks are in the DB', async () => {
        await init.initPoliticalRanks();
        const count = await PoliticalRankModel.countDocuments({});
        expect(count).toBe(8);
      });

      it('Calling initialize twice doesn\'t create duplicate instances', async () => {
        await init.initPoliticalRanks();
        const count = await PoliticalRankModel.countDocuments({});
        expect(count).toBe(8);
      });

    });

  });


  describe('GameStateModel Tests', () => {
    
    before(async () => {
      await GameStateModel.deleteMany({});
    });

    describe('Check that db collections are empty', () => {

      it('No Game States in DB', async () => {
        const count = await GameStateModel.countDocuments({});
        expect(count).toBe(0);
      });

    });

    describe('Verify Game State Initialization', () => {

      it('3 Game States are in the DB', async () => {
        await init.initGameStates();
        const count = await GameStateModel.countDocuments({});
        expect(count).toBe(3);
      });

      it('Calling initialize twice doesn\'t create duplicate instances', async () => {
        await init.initGameStates();
        const count = await GameStateModel.countDocuments({});
        expect(count).toBe(3);
      });

    });

  });


  describe('UserModel Tests', () => {

    before(async () => {
      await UserModel.deleteMany({});
    });

    after(async () => {
      await UserModel.deleteMany({});
    });

    describe('Check that db collections are empty', () => {
      
      it('No Users in DB', async () => {
        const count = await UserModel.countDocuments({});
        expect(count).toBe(0);
      });

    })
    
    describe('Verify Users Initialization', () => {

      it('2 Users are in the DB', async () => {
        await init.initUsers();
        const count = await UserModel.countDocuments({});
        expect(count).toBe(2);
      });

      it('Calling initialize twice doesn\'t create duplicate instances', async () => {
        await init.initUsers();
        const count = await UserModel.countDocuments({});
        expect(count).toBe(2);
      });

    });


  });

  describe('PlayerModel Tests', () => {

    before(async () => {
      await PlayerModel.deleteMany({});
      await UserModel.deleteMany({});
    });

    after(async () => {
      await PlayerModel.deleteMany({});
      await UserModel.deleteMany({});
    });

    describe('Check that db collections are empty', () => {
      
      it('No Players in DB', async () => {
        const count = await PlayerModel.countDocuments({});
        expect(count).toBe(0);
      });

    })
    
    describe('Verify Players Initialization', () => {

      it('2 Players are in the DB', async () => {
        await init.initPlayers();
        const count = await PlayerModel.countDocuments({});
        expect(count).toBe(2);
      });

      it('Calling initialize twice doesn\'t create duplicate instances', async () => {
        await init.initUsers();
        const count = await UserModel.countDocuments({});
        expect(count).toBe(2);
      });

    });

  });


  describe('GameModel Tests', () => {

    before(async () => {
      await GameModel.deleteMany({});
    });

    after(async () => {
      await GameModel.deleteMany({});
      await PlayerModel.deleteMany({});
      await UserModel.deleteMany({});
    });

    describe('Check that db collections are empty', () => {
      
      it('No Games in DB', async () => {
        const count = await GameModel.countDocuments({});
        expect(count).toBe(0);
      });

    })
    
    describe('Verify Game Initialization', () => {

      it('1 Game is in the DB', async () => {
        await init.initGame();
        const count = await GameModel.countDocuments({});
        expect(count).toBe(1);
      });

      it('Calling initialize twice doesn\'t create duplicate instances', async () => {
        await init.initGame();
        const count = await GameModel.countDocuments({});
        expect(count).toBe(1);
      });

    });

  });

});