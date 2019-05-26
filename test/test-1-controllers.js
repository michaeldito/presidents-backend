const { Game } = require('../src/controllers');
const { PlayerModel, GameModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const { game } = require('./Mongo/data');
require('dotenv').config();

describe('Controller Tests', () => {

  before(async () => {
    const options = { useNewUrlParser: true, useCreateIndex: true };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
  });

  after(async () => {
    await mongoose.connection.close();
  });



  describe('Game Controller Tests', () => {    
    
    before(async () => {
      await init.initPlayers();
    });

    after(async () => {
      await PlayerModel.deleteMany({});
      await GameModel.deleteMany({});
    });

    describe('Create a game', () => {

      it('createGame() returns the game if successful', async () => {
        const player = await PlayerModel.findOne({});
        const id = await Game.createGame(player._id, game);
        expect(id).toBeTruthy();
      });

      it('createGame() returns error for duplicate game name', async () => {
        const player = await PlayerModel.findOne({});
        let error = await Game.createGame(player._id, game);
        expect(error.message).toBe('A game with that name already exists.');
      });

    });

    describe.skip('Join a game', () => {

      it('joinGame() adds player not already in the game', async () => {
        
      });

      it('joinGame() prevents duplicate join', async () => {
        
      });

      it('joinGame() is not allowed if game has begun', async () => {
        
      });

    });


  });

});