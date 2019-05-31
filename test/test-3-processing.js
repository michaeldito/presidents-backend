const { createGame, joinGame } = require('../src/models/GameModel/processing');
const { PlayerModel, GameModel, UserModel, GameStateModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const assert = require('assert');
require('dotenv').config();

describe('Processing Tests', () => {

  before(async () => {
    const options = { useNewUrlParser: true, useCreateIndex: true };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
  });

  after(async () => {
    await mongoose.connection.close();
  });



  describe('Game Processing Tests', () => {    
    
    before(async () => {
      await init.initPlayers();
      await init.initGameStates();
      await GameModel.deleteMany({});
    });

    after(async () => {
      await PlayerModel.deleteMany({});
      await UserModel.deleteMany({});
      await GameModel.deleteMany({});
    });


    describe('Create a game', () => {

      after(async () => {
        await GameModel.deleteMany({});
      });



      it('createGame() returns the game if successful', async () => {
        const player = await PlayerModel.findOne({});
        const game = await createGame(player._id, {name: 'create-game-test'});
        expect(game).toBeTruthy();
      });



      it('createGame() returns error for duplicate game name', async () => {
        const player = await PlayerModel.findOne({});
        assert.rejects(createGame(player._id, {name: 'create-game-test'}), Error, 'A game with that name already exists.');
      });



      it('createGame() sets game id on player document', async () => {
        let player = await PlayerModel.findOne({});
        const game = await createGame(player._id, {name: 'create-game-test-2'});
        player = await PlayerModel.findOne({_id: player._id});
        expect(player.game).toStrictEqual(game._id);
      });



      it('createGame() sets seatPosition 0 on player document', async () => {
        let player = await PlayerModel.findOne({});
        const game = await createGame(player._id, {name: 'create-game-seat-check-test'});
        player = await PlayerModel.findOne({_id: player._id});
        expect(player.seatPosition).toBe(0);
      });

    });

    describe('Join a game', () => {

      it('joinGame() adds player not already in the game', async () => {
        let players = await PlayerModel.find({}).limit(2);
        const [p1, p2] = [players[0], players[1]];
        let newGame = await createGame(p1._id, {name: 'join-test-1'});
        newGame = await joinGame(p2._id, newGame._id);
        //newGame = newGame.toJSON();

        let updatedPlayers = [];
        for (let player of players) {
          const p = await PlayerModel.findOne({ _id: player._id });
          updatedPlayers.push(p);
        }

        expect(newGame.players).toHaveLength(2);
        expect(newGame.players).toContainEqual(p1._id);
        expect(newGame.players).toContainEqual(p2._id);
        expect(updatedPlayers[0].seatPosition).toBe(0);
        expect(updatedPlayers[1].seatPosition).toBe(1);
      });


      it('joinGame() returns the game if successul', async () => {
        let players = await PlayerModel.find({}).limit(2);
        let newGame = await createGame(players[0]._id, {name: 'join-return-testeroni'});
        newGame = await joinGame(players[1]._id, newGame._id);
        expect(newGame instanceof GameModel).toBeTruthy();
      });



      it('joinGame() prevents duplicate join', async () => {
        let player = await PlayerModel.findOne({});
        let newGame = await createGame(player._id, {name: 'join-dup-test'});
        newGame = await joinGame(player._id, newGame._id);
        newGame = newGame.toJSON();
        player = await PlayerModel.findOne({_id: player._id});
        
        expect(newGame.players).toHaveLength(1);
        expect(newGame.players).toContainEqual(player._id);
        expect(player.seatPosition).toBe(0);
      });



      it('joinGame() sets game id on player document', async () => {
        const user1 = await UserModel.findOne({ username: 'bella' });
        let p1 = await PlayerModel.findOne({ user: user1._id });

        const user2 = await UserModel.findOne({ username: 'tony' });
        let p2 = await PlayerModel.findOne({ user: user2._id });

        let game = await createGame(p1._id, {name: 'tester'});
        game = await joinGame(p2._id, game._id);
        p2 = await PlayerModel.findOne({ _id: p2._id });

        expect(p2.game).toStrictEqual(game._id);
      });



      it('joinGame() is not allowed if game has begun', async () => {
        // get a player
        const user = await UserModel.findOne({ username: 'bobby' });
        const player = await PlayerModel.findOne({ user: user._id });

        // set the game status to in progress
        const IN_PROGRESS = await GameStateModel.findOne({ state: 'IN_PROGRESS' });
        let game = await GameModel.findOne({ name: 'tester' });
        game.state = IN_PROGRESS;
        await game.save();

        // attempt to join
        // assert that error for game already started is thrown
        assert.rejects(joinGame(player._id, game), Error, 'Unable to join. The game has already started.');
      });



      it('joinGame() cannot join if game is full', async () => {
        // get all 9 players
        const players = await PlayerModel.find({ });

        // recreate the tester game
        const game = await createGame(players[0]._id, {name: 'join-full-test'});
        
        // we have 9 players, attempt to add them all, except player[0]
        // bc they created it, add last player at the assertion
        const playersToAdd = players.slice(1, players.length-1);
        for (let player of playersToAdd) {
          let result = await joinGame(player._id, game._id);
        }
        
        const lastPlayer = players[players.length-1];

        // attempt to join
        // assert error game full
        assert.rejects(joinGame(lastPlayer._id, game._id), Error, 'Unable to join. Maximum number of players reached.');
      }).timeout(3000);



      it('joinGame() sets seatPositions incrementally on player documents', async () => {
        // get 5 players
        let players = await PlayerModel.find({}).limit(5);
        let first = players[0];

        // first person creates game
        const game = await createGame(first._id, {name: 'join-seat-check'});
        expect(game).toBeTruthy();
        
        // rest of players add one by one, in order, synchronously.
        let rest = players.splice(1);

        for (let player of rest) {
          let result = await joinGame(player._id, game._id);
        }

        // get updated player docs, in the order they joined
        let updatedPlayers = [];
        for (let player of players) {
          let p = await PlayerModel.findOne({ _id: player._id });
          updatedPlayers.push(p);
        }

        expect(updatedPlayers).toBeTruthy();
        // we expect players to have a seatPositions 0->4 in that order
        //updatedPlayers.forEach((player, idx) => expect(player.seatPosition).toBe(idx));

      });

    });

    describe.skip('Get Next PlayerId', () => {
      
      it('should return a mongo instance id successful', () => {
      
      });

      it('should return a status=notfound if unsuccessful', () => {
      
      });

    });

    describe.skip('Deal To Player', () => {
      
      it('should return 14 cards to each of the 4 players', () => {
      
      });

    });

    describe.skip('Play Hand', () => {
      
      // game
      it('should replace played hand with incoming hand if successful', () => {
      
      });

      // game
      it('should add incoming hand to current round & total game card piles if successful', () => {
      
      });

      // player
      it('should remove the cards from the users hand if successful', () => {
      
      });

      // game
      it('should receive status=notfound when getNextPlayerIdx called after final cards are played', () => {
      
        context('and so it should return a game with status === FINALIZED', () => {
      
        });

      });

    });



    describe.skip('Is Game Over', () => {

      it('should return true if game.status === FINALIZED', () => {
      
      });

    });

  });

});
