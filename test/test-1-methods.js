const { CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, GameConfigModel, 
  GameModel, RoundModel, RankAssignmentModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const connectToMongo = require('../src/config/db');

require('dotenv').config();


describe('Model Method Tests', function() {
    
  before(async function() {
    await connectToMongo();
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

    it('getRanks(howMany) returns ranks 1->howMany inclusive', async function() {    
      const ranks = await PoliticalRankModel.getRanks(2);
      ranks.forEach(rank => expect(rank.value > 0 && rank.value < 3).toBeTruthy())
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

      it('Game has players array with size 1', async function() {
        expect(game.players.length).toBe(1);
      });

      it('Correct User saved for player', async () => {
        let player = await PlayerModel.findById(game.players[0]).populate('user');
        expect(player.user.username).toBe(user.username);
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
        try {
          await game.addPlayer(users[0]);
        } catch (err) {
          expect(err.message).toBe('User has already joined game.');
        }
      });

      it('should throw error if capacity reached', async function() { 
        const rest = users.slice(1, users.length-1); 
        for (let user of rest) {
          //console.log(`adding user: ${user._id}`)
          try {
            await game.addPlayer(user);
          } catch (err) {
            console.log('Couldn\'t add 7 players to make capacity 8. One of the users might be in the game already.');
          }
        } 
        // above synch code allows us to catch err, below does not
        // Promise.all(rest.map(user=>game.addPlayer(user)));
        const lastPlayer = users[users.length-1];
        try {
          await game.addPlayer(lastPlayer);
        } catch (err) {
          expect(err.message).toBe('Cannot join game. It is already full.');
        }      
      })


      it('should throw error if no user passed', async function() {    
        try {
          await game.addPlayer();
        } catch (err) {
          expect(err.message).toBe('Missing argument, user is required.');
        }
      });


      it('should throw error if game is in progress', async function() {    
        try {
          game.rounds = ['someRandomId'];
          await game.save();
          await game.addPlayer(users[0]);
        } catch (err) {
          expect(err.message).toBe('Cannot join game. It is already in progress.');
        }
      });

  
    });


    describe('startFirstRound()', function() {   
      let users;
      let game;
      let gameConfig

      before(async function() {
        users = await UserModel.findRandoms(2);
        gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
        game = await GameModel.create(users[0], {name: 'start-game-test'}, gameConfig);
        game = await game.addPlayer(users[1]);
        game = await game.startFirstRound();
      })
    
      it('should set allowed ranks on game', async function() {  
        expect(game.allowedRanks.length).toBe(game.players.length);
      });

      it('should add a round to game', async function() {    
        expect(game.rounds.length).toBe(1);
      });

      it('players should have been dealt 26 cards each', async function() { 
        const p1 = await PlayerModel.findById(game.players[0]._id);
        const p2 = await PlayerModel.findById(game.players[1]._id);
        expect(p1.hand.length).toBe(26);
        expect(p2.hand.length).toBe(26);
      });

      it('game.currentRound is set & game.round.roundNumber is 1', async function() {
        expect(game.currentRound).toBeTruthy();
        const r = await RoundModel.findById(game.currentRound); 
        expect(r.roundNumber).toBe(1); 
      });

      it('game.round.currentPlayer should have 3 ♣', async function() {
        const r = await RoundModel.findById(game.currentRound);
        const p = await PlayerModel.findById(r.currentPlayer);
        let found = false;
        for (let card of p.hand)
          if (card.shortHand === '3Clubs')
            found = true;
        expect(found).toBeTruthy();
      });

      it('all players should have one rank assignment', async function() {  
        const playersInGame = await PlayerModel.find({'_id': { $in: game.players } });
        playersInGame.forEach(p => expect(p.rankAssignments.length).toBe(1));
      });

      it('all players should have one null rank assignment', async function() {  
      });

      it('round.playerRankAssignments should have 2 null ranks', async function() {  
      });
    });

    describe.skip('playerTakesTurn()', function() {   
      let users;
      let game;
      let gameConfig
  
      before(async function() {
        users = await UserModel.findRandoms(2);
        gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
        game = await GameModel.create(users[0], {name: 'take-turn-test'}, gameConfig);
        game = await game.addPlayer(users[1]);
        game = await game.startFirstRound();
      })
    
      it('should throw error if not players turn', async function() {  
      });
  
      it('should throw error if passing and have cards selected', async function() {  
      });
  
      it('should throw error if cards are not >= last turns cards', async function() {  
      });
  
      it('should skip one time, so current player is the same', async function() {  
      });
  
      it('skip makes game.turn.length === 2', async function() {  
      });
  
      it('should finalize game when only 1 player has cards left', async function() {  
      });
  
      it('should set next player correctly', async function() {  
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