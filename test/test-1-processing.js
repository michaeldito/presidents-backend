const { createGame } = require('../src/models/GameModel/processing');
const { PlayerModel, GameModel } = require('../src/models');
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
    });

    after(async () => {
      await PlayerModel.deleteMany({});
      await GameModel.deleteMany({});
    });

    describe('Create a game', () => {

      it('createGame() returns the game if successful', async () => {
        const player = await PlayerModel.findOne({});
        const id = await createGame(player._id, game);
        expect(id).toBeTruthy();
      });

      it('createGame() returns error for duplicate game name', async () => {
        const player = await PlayerModel.findOne({});
        assert.rejects(createGame(player._id, game), Error, 'A game with that name already exists.');
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