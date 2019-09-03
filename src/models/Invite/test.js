const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initInviteStatuses, drop: dropInviteStatuses } = require('../InviteStatus/test');
const { init: initGames, drop: dropGames } = require('../Game/test');
const { init: initGameStatus, drop: dropGameStatus } = require('../GameStatus/test');
const { init: initConfigs, drop: dropConfigs } = require('../GameConfiguration/test');

const Invite = require('./');
const User = require('../User');
const InviteStatus = require('../InviteStatus');
const Game = require('../Game');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const forUser = await User.findByUsername('tommypastrami');
  const seenByUser = false;
  const sentBy = forUser;
  const status = await InviteStatus.findByStatus('PENDING');
  const game = await Game.findOne({name: 'test game'});
  const invite = { forUser, seenByUser, sentBy, status, game };

  await Invite.create(invite);
}

const drop = async () => {
  await Invite.deleteMany({});
}

const test = async () => describe('Invite', function() {
    
  before(async function() {
    await db.connect();
    await initGameStatus();
    await initConfigs();
    await initUsers();
    await initInviteStatuses();
    await initGames();
  });

  after(async function() {
    await dropUsers();
    await dropGameStatus();
    await dropConfigs();
    await dropInviteStatuses();
    await dropGames();
    await db.close();
  });

  it('Verify init() initializes 1 invite document', async function() {    
    await init();
    const docs = await Invite.find({});
    expect(docs.length).toBe(1);
  });
    

  it('Verify drop() deletes all invite documents', async function() { 
    await drop();   
    const docs = await Invite.find({});
    expect(docs.length).toBe(0);
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  test();
}



module.exports = { init, drop, test};