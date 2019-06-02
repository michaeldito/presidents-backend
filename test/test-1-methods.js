const { CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, GameConfigModel, 
  GameModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const assert = require('assert');
require('dotenv').config();


describe('Model Method Tests', function() {
    
  before(async function() {
    const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
    await init.dropAll();
    await init.initPresidents();
  });

  after(async function() {
    await init.dropAll();
    await mongoose.connection.close();
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



  describe('DeckModel', function() {    
    
    it('', async function() {    

    });

  });



  describe('GameConfigModel', function() {    
    
    it('', async function() {    

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



  describe('GameModel', function() {    

    describe('create()', function() {
      let user;
      let game;
      let gameConfig

      before(async function() {
        user = await UserModel.findOne({});
        gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
        game = await GameModel.create(user, {name: 'create-game-test'}, gameConfig);
      });

      it('Game was created.', async function() {
        expect(game).toBeTruthy();
      });

      it('Game was saved in database', async function() {
        const savedGame = await GameModel.findById(game._id);
        expect(savedGame).toBeTruthy();
      });

      it('Saved Game has players array with size 1', async function() {
        let savedGame = await GameModel.findById(game._id).populate('players');
        expect(savedGame.players.length).toBe(1);
      });

      it('Correct User saved for player', async () => {
        let savedGame = await GameModel.findById(game._id).populate({path: 'players', populate: {path: 'user'}});
        expect(savedGame.players[0].user.username).toBe(user.username);
      });

    });

    describe('addPlayer()', function() {   
      
      let users;
      let game;
      let gameConfig

      before(async function() {
        users = await UserModel.findRandoms(9);
        gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
        game = await GameModel.create(users[0], {name: 'join-game-test'}, gameConfig);
      })
    
      it('should throw error if user already joined', async function() {  
        assert.rejects(game.addPlayer(users[0]), Error, 'User has already joined game.');
      });

      it('should throw error if capacity reached', async function() { 
        let rest = users.slice(1, users.length-1);  
        for (let user of rest) {
          console.log(`adding user: ${user._id}`)
          await game.addPlayer(user);
        } 
        const lastPlayer = users[users.length-1];
        assert.rejects(game.addPlayer(lastPlayer), Error, 'Cannot join game. It is already full.');
      })

      it.skip('should throw error if game is in progress', async function() {    
        assert.rejects(game.addPlayer(), Error, 'Cannot join game. It is already in progress.');
      });
  
    });

  });

  

  describe('RoundModel', function() {    
    
    it('', async function() {    

    });

  });


  

  describe('TurnModel', function() {    
    
    it('', async function() {    

    });

  });

    

});
