const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const { init: initCards, drop: dropCards } = require('../Card/test');
const { init: initGameStatuses, drop: dropGameStatuses } = require('../GameStatus/test');
const { init: initGameConfigurations, drop: dropGameConfigurations } = require('../GameConfiguration/test');

const Card = require('../Card');
const GameStatus = require('../GameStatus');
const GameConfiguration = require('../GameConfiguration');
const User = require('../User');
const WarGame = require('./');
const Game = require('../Game');

const db = require('../../config/db');
const expect = require('expect');
const mongoose = require('mongoose');

const init = async () => {
  const count = await WarGame.countDocuments({});
  if (count === 1) 
    return Promise.resolve();

  const name = 'test war game';
  const status = await GameStatus.findByValue('NOT_STARTED');
  const config = await GameConfiguration.findOne({name: 'War'});
  const rules = { reverseWar: false };
  const cards = await Card.find({}).limit(8);
  const createdBy = await User.findByUsername('tommypastrami');

  const user1 = createdBy;
  const card1 = cards[0];
  const player1Turn = {
    card: card1,
    user: user1
  };

  const user2 = await User.findByUsername('johnnyroastbeef');
  const card2 = cards[1];
  const player2Turn = {
    card: card2,
    user: user2
  };
  const causedBattle = true;

  const battleCardsDown1 = cards.slice(2, 4);
  const battleCardUp1 = cards[4];
  const player1Battle = {
    battleCardsDown: battleCardsDown1,
    battleCardUp: battleCardUp1
  };

  const battleCardsDown2 = cards.slice(5, 7);
  const battleCardUp2 = cards[7];
  const player2Battle = {
    battleCardsDown: battleCardsDown2,
    battleCardUp: battleCardUp2
  };

  const winner = user1;

  const player1 = { 
    user: user1,
    joinedAt: new Date(),
    seatPosition: 1,
    hand: battleCardsDown1,
    battlesWon: 1,
    battlesLost: 0
  };

  const player2 = { 
    user: user2,
    joinedAt: new Date(),
    seatPosition: 2,
    hand: battleCardsDown2,
    battlesWon: 0,
    battlesLost: 1
  };

  const game = {
    name,
    config,
    status, 
    winner,
    startedAt: new Date(),
    rules,
    currentPlayer: user1,
    createdBy: user1,
    turns: [{
      player1Turn,
      player2Turn,
      winner,
      causedBattle,
      player1Battle,
      player2Battle
    }],
    players: [player1, player2]
  };

  await WarGame.create(game);
}

const drop = async () => {
  await WarGame.deleteMany({});
}

const test = async () => describe('WarGame', async function() {
    
  before(async function() {
    await db.connect();
    await Promise.all([
      initCardRanks(),
      initSuits()
    ]);
    await Promise.all([
      initUsers(),
      initGameStatuses(),
      initCards()
    ]);
    await initGameConfigurations();
  });

  after(async function() {
    await Promise.all([
      dropCardRanks(),
      dropSuits(),
      dropCards(),
      dropUsers(),
      dropGameStatuses(),
      dropGameConfigurations()
    ]);
    await db.close();
  });

  describe('#init()', async function() {    

    it('verify it creates 1 war game document', async function() {  
      await init();  
      const docs = await WarGame.find({});
      // docs[0].config.deck=[]
      // console.log(JSON.stringify(docs[0], null, 2))
      expect(docs.length).toBe(1);
    });


    describe('validations', async function() {    

      describe('rules', async function() {    

        it('rules.reverseWar is required', async function() {
          const instance = new WarGame({});
          const error = instance.validateSync();
          const message = 'A value is required for rules.reverseWar to create a war game.';
          
          expect(error.errors['rules.reverseWar'].message).toBe(message);
        });

      });

      describe('turns', async function() {  

        it('turns[i].player1Turn.card is required', async function() {    
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].player1Turn.card is required.';	
            expect(error.errors['turns.1.player1Turn.card'].message).toBe(message);
          });
        });

        it('turns[i].player1Turn.user is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].player1Turn.user is required.';	
            expect(error.errors['turns.1.player1Turn.user'].message).toBe(message);
          });
        });

        it('turns[i].player2Turn.card is required', async function() {    
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].player2Turn.card is required.';	
            expect(error.errors['turns.1.player2Turn.card'].message).toBe(message);
          });
        });

        it('turns[i].player2Turn.user is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].player2Turn.user is required.';	
            expect(error.errors['turns.1.player2Turn.user'].message).toBe(message);
          });
        });

        it('turns[i].causedBattle is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].causedBattle is required.';	
            expect(error.errors['turns.1.causedBattle'].message).toBe(message);
          });
        });

        it('turns[i].player1Battle is required', async function() {    
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].player1Battle is required.';	
            expect(error.errors['turns.1.player1Battle'].message).toBe(message);
          });
        });

        it('turns[i].player2Battle is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({});
          doc.save(error => {
            const message = 'A value for turns[i].player2Battle is required.';	
            expect(error.errors['turns.1.player2Battle'].message).toBe(message);
          });
        });

        it('turns[i].player1Battle.battleCardsDown is required', async function() {    
          const doc = await WarGame.findOne({});
          doc.turns.push({
            player1Battle: {},
            player2Battle: {}
          });
          doc.save(error => {
            const message = 'battle cards down must contain two cards.';	
            expect(error.errors['turns.1.player1Battle.battleCardsDown'].reason.message).toBe(message);
          });
        });

        it('turns[i].player2Battle.battleCardsDown is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({
            player1Battle: {},
            player2Battle: {}
          });
          doc.save(error => {
            const message = 'battle cards down must contain two cards.';	
            expect(error.errors['turns.1.player2Battle.battleCardsDown'].reason.message).toBe(message);
          });
        });

        it('turns[i].player1Battle.battleCardUp is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({
            player1Battle: {},
            player2Battle: {}
          });;
          doc.save(error => {
            const message = 'A value for battleCardUp is required.';	
            expect(error.errors['turns.1.player1Battle.battleCardUp'].message).toBe(message);
          });
        });

        it('turns[i].player2Battle.battleCardUp is required', async function() {
          const doc = await WarGame.findOne({});
          doc.turns.push({
            player1Battle: {},
            player2Battle: {}
          });
          doc.save(error => {
            const message = 'A value for battleCardUp is required.';	
            expect(error.errors['turns.1.player2Battle.battleCardUp'].message).toBe(message);
          });
        });

      });

      describe('players', async function() {    

        it('players[i].user is required', async function() {
          const doc = await WarGame.findOne({});
          doc.players.push({});
          doc.save(error => {
            const message = 'A value for players[i].user is required.';
            expect(error.errors['players.2.user'].message).toBe(message);
          });
        });

        it('players[i].seatPosition is required', async function() {
          const doc = await WarGame.findOne({});
          doc.players.push({});
          doc.save(error => {
            const message = 'A value for players[i].seatPosition is required.';
            expect(error.errors['players.2.seatPosition'].message).toBe(message);
          });
        });

        it('players[i].battlesWon is required', async function() {
          const doc = await WarGame.findOne({});
          doc.players.push({});
          doc.save(error => {
            const message = 'A value for players[i].battlesWon is required.';
            expect(error.errors['players.2.battlesWon'].message).toBe(message);
          });
        });

        it('players[i].battlesLost is required', async function() {
          const doc = await WarGame.findOne({});
          doc.players.push({});
          doc.save(error => {
            const message = 'A value for players[i].battlesLost is required.';
            expect(error.errors['players.2.battlesLost'].message).toBe(message);
          });
        });

      });
      
    });

  });

  describe('#drop()', async function() {    

    it('verify it deletes all war game documents', async function() {    
      await drop();
      const docs = await WarGame.find({});
      expect(docs.length).toBe(0);
    });

  });

});

module.exports = { init, drop, test };