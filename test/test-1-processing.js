const { createGame, joinGame } = require('../src/models/GameModel/processing');
const { PlayerModel, GameModel, UserModel, GameStateModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const { game } = require('./Mongo/data');
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
        const p1 = await PlayerModel.findOne({});
        const id = await createGame(p1._id, game);
        expect(id).toBeTruthy();
      });

      it('createGame() returns error for duplicate game name', async () => {
        const p1 = await PlayerModel.findOne({});
        assert.rejects(createGame(p1._id, game), Error, 'A game with that name already exists.');
      });

      it('createGame() sets game id on player document', async () => {
        let p1 = await PlayerModel.findOne({});
        const game = await createGame(p1._id, {name: 'another name'});
        p1 = await PlayerModel.findOne({_id: p1._id});
        expect(p1.game).toStrictEqual(game._id);
      });

    });

    describe('Join a game', () => {

      it('joinGame() adds player not already in the game', async () => {
        const players = await PlayerModel.find({});
        const [p1, p2] = [players[0], players[1]];
        let newGame = await createGame(p1._id, game);
        newGame = await joinGame(p2._id, newGame._id);
        newGame = newGame.toJSON();
        
        expect(newGame.players).toHaveLength(2);
        expect(newGame.players).toContainEqual(p1._id);
        expect(newGame.players).toContainEqual(p2._id);
          
      });

      it('joinGame() prevents duplicate join', async () => {
        const players = await PlayerModel.find({});
        const [p1, p2] = [players[0], players[1]];
        newGame = await joinGame(p1._id, p1.game);
        newGame = await joinGame(p2._id, p2.game);
        newGame = newGame.toJSON();
        
        expect(newGame.players).toHaveLength(2);
        expect(newGame.players).toContainEqual(p1._id);
        expect(newGame.players).toContainEqual(p2._id);
      });

      it('joinGame() sets game id on player document', async () => {
        const players = await PlayerModel.find({});
        let [p1, p2] = [players[0], players[1]];
        let game = await createGame(p1._id, {name: 'tester'});
        game = await joinGame(p2._id, game._id);
        p2 = await PlayerModel.findOne({ _id: p2._id });
        expect(p2.game).toStrictEqual(game._id);
      });

      it('joinGame() is not allowed if game has begun', async () => {
        // get a player not in the game
        const user = await UserModel.findOne({ username: 'jethro' });
        const player = await PlayerModel.findOne({ user: user._id });

        // set the game status to in progress
        const IN_PROGRESS = await GameStateModel.findOne({ status: 'IN_PROGRESS '});
        let game = await GameModel.findOne({ name: 'tester' });
        game.status = IN_PROGRESS;
        await game.save();

        // attempt to join
        // assert that error for game already started is thrown
        assert.rejects(joinGame(player._id, game), Error, 'Unable to join. The game has already started.');
      });

      it('joinGame() cannot join if game is full', async () => {
        // get all 9 players
        const players = await PlayerModel.find({ });

        await GameModel.deleteOne({name: 'tester'});
        // recreate the tester game
        const game = await createGame(players[0]._id, {name: 'tester'});
        
        // we have 9 players, attempt to add them all, except player[0]
        // bc they created it, add last player at the assertion
        const playersToAdd = players.slice(1, players.length-1);
        const promises = playersToAdd.map(player => joinGame(player._id, game._id))
        await Promise.all(promises);
        
        const lastPlayer = players[players.length-1];
        // attempt to join
        // assert error game full
        assert.rejects(joinGame(lastPlayer._id, game._id), Error, 'Unable to join. Maximum number of players reached.');
      });

    });

  });

});