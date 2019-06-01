const { CardModel, CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, GameModel,
  GameStateModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
require('dotenv').config();


describe('Model Method Tests', function() {
    
  before(async function() {

    this.slow(4000);

    const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await UserModel.deleteMany({});
    await PlayerModel.deleteMany({});
    await GameModel.deleteMany({});
    await GameStateModel.deleteMany({});
    
  });

  after(async function() {

    this.slow(4000);

    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await UserModel.deleteMany({});
    await PlayerModel.deleteMany({});
    await GameModel.deleteMany({});
    await GameStateModel.deleteMany({});
    await mongoose.connection.close();
  });


  describe('DB', function() { 
    this.timeout(3000)

    it('db check', async function() { 

      await init.initCards();
      await init.initPlayers();
      await init.initGameStates();
      await init.initPoliticalRanks();
      await init.initGame();

      const cards = await CardModel.find({});
      const suits = await SuitModel.find({});
      const ranks = await CardRankModel.find({});
      const users = await UserModel.find({});
      const players = await PlayerModel.find({});
      const games = await GameModel.find({});
      const states = await GameStateModel.find({});
      const polRanks = await PoliticalRankModel.find({});
      
      expect(cards.length).toBe(52);
      expect(suits.length).toBe(4);
      expect(ranks.length).toBe(13);
      expect(users.length).toBe(10);
      expect(players.length).toBe(10);
      expect(games.length).toBe(1);
      expect(states.length).toBe(3);
      expect(polRanks.length).toBe(8);

    });

  });


  describe('CardRankModel', function() {    
    
    it('getRankByCharacter returns ace', async function() {    
      const ace = await CardRankModel.findByChar('A');
      expect(ace.character).toBe('A');
    });

  });


  describe('SuitModel', function() {    
    
    it('getSuitByName returns clubs', async function() {    
      const ace = await SuitModel.findByName('Clubs');
      expect(ace.name).toBe('Clubs');
    });

  });


  describe('GameStateModel', function() {    
    
    describe('findByState(state)', function() {    
    
      context('should return instance if successful', function() {    
    
        it('should return NOT_STARTED', async function() {  
          const notStarted = await GameStateModel.findByState('NOT_STARTED');  
          expect(notStarted.state).toBe('NOT_STARTED');
        });

        it('should return IN_PROGRESS', async function() {    
          const inProgress = await GameStateModel.findByState('IN_PROGRESS');  
          expect(inProgress.state).toBe('IN_PROGRESS');
        });

        it('should return FINALIZED', async function() {    
          const finalized = await GameStateModel.findByState('FINALIZED');  
          expect(finalized.state).toBe('FINALIZED');
        });

        it('should throw error if no instance found', async function() {    
          const foo = await GameStateModel.findByState('foo');  
          expect(foo).toBeFalsy();
        });

      });

    });

  });


  describe('PoliticalRankModel', function() {    
    
    it('findByName(name)', async function() {    
      const rank = await PoliticalRankModel.findByName('Asshole');
      expect(rank.name).toBe(`Asshole`);
    });

    it('findByValue(value)', async function() {    
      const rank = await PoliticalRankModel.findByValue(1);
      expect(rank.value).toBe(1);
    });

  });


  describe('UserModel', function() {    
    
    describe('findByUsername(username)', function() {    
    
      it('should return instance if successful', async function() {    
        const user = await UserModel.findByUsername('bella');
        expect(user.username).toBe('bella');
      });

    });

  });


  describe('PlayerModel', function() {   
    
    describe('findAll()', function() {    
    
      it('should return all instances if successful', async function() {    
        const players = await PlayerModel.findAll();
        expect(players).toBeTruthy();
      });

    });
    

    describe('findRandom()', function() {    
    
      it('should return instance if successful', async function() {    
        const player = await PlayerModel.findRandom();
        expect(player).toBeTruthy();
      });

    });


    describe('findRandoms(howMany)', function() {    
    
      it('should return instances if successful', async function() {    
        const players = await PlayerModel.findRandoms(3);
        expect(players.length).toBe(3);
      });
      
    });


    describe.skip('findByUsername(username)', function() {    
    
      it('should return instance if successful', async function() {    
        const player = await PlayerModel.findByUsername('bella');
        expect(players.length).toBe(3);
      });

    });

  });


  describe('GameModel', function() {  
    
    describe('findByName(name)', function() {    
    
      it('should return instance if successful', async function() {    
        const game = await GameModel.findByName('test-game');
        expect(game.name).toBe(`test-game`);
      });

    });

  });
    

});
