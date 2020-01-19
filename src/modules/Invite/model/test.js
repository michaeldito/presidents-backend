const { init: initUsers, drop: dropUsers } = require('../../User/model/test');
const { init: initInviteStatuses, drop: dropInviteStatuses } = require('../../InviteStatus/model/test');
const { init: initGames, drop: dropGames } = require('../../Game/model/test');
const { init: initGameStatus, drop: dropGameStatus } = require('../../GameStatus/model/test');
const { init: initConfigs, drop: dropConfigs } = require('../../GameConfiguration/model/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../../CardRank/model/test');
const { init: initSuits, drop: dropSuits } = require('../../Suit/model/test');
const { init: initCards, drop: dropCards } = require('../../Card/model/test');

const Invite = require('./');
const User = require('../../User');
const InviteStatus = require('../../InviteStatus');
const Game = require('../../Game');

const db = require('../../../config/db');
const expect = require('expect');
const mongoose = require('mongoose');


const init = async () => {
  const count = await Invite.countDocuments({});
  if (count === 1) 
    return Promise.resolve();

  const forUser = mongoose.Types.ObjectId()
  const seenByUser = false;
  const sentBy = forUser;
  const status = await InviteStatus.findByValue('PENDING');
  const game = mongoose.Types.ObjectId()
  const invite = { forUser, seenByUser, sentBy, status, game };

  await Invite.create(invite);
}

const drop = async () => {
  await Invite.deleteMany({});
}

const test = async () => describe('Invite', async function() {
    
  before(async function() {
    this.slow(20000)
    await db.connect();
    await Promise.all([
      initGameStatus(),
      initCardRanks(),
      initSuits(),
      initInviteStatuses()
    ]);
    await initCards();
    await initConfigs();
  });

  after(async function() {
    await dropCards();
    await dropCardRanks();
    await dropSuits();
    await dropGameStatus();
    await dropConfigs();
    await dropInviteStatuses();
    await db.close();
  });

  describe('#init()', async function() {    

    it('verify it initializes 1 invite document', async function() {    
      await init();
      const docs = await Invite.find({});
      expect(docs.length).toBe(1);
    });

    describe('validations', async function() {    

      it('sentBy is required', async function() {
        const invite = { 
          status: mongoose.Types.ObjectId(),
          game: mongoose.Types.ObjectId()
         };
        const instance = new Invite(invite);
        const error = instance.validateSync();
        const message = 'A sentBy is required to create an invite.';

        expect(error.errors['sentBy'].message).toBe(message);
      });

      it('status is required', async function() {    
        const invite = { 
          sentBy: mongoose.Types.ObjectId(),
          game: mongoose.Types.ObjectId()
         };
        const instance = new Invite(invite);
        const error = instance.validateSync();
        const message = 'A status is required to create an invite.';

        expect(error.errors['status'].message).toBe(message);
      });

      it('game is required', async function() {    
        const invite = { 
          sentBy: mongoose.Types.ObjectId(),
          status: mongoose.Types.ObjectId()
         };
        const instance = new Invite(invite);
        const error = instance.validateSync();
        const message = 'A game is required to create an invite.';

        expect(error.errors['game'].message).toBe(message);
      });
      
    });

  });

    
  describe('#drop()', async function() {    

    it('verify it deletes all invite documents', async function() { 
      await drop();   
      const docs = await Invite.find({});
      expect(docs.length).toBe(0);
    });

  });

  
});

module.exports = { init, drop, test};