const GameStatus = require('./');
const { gameStatuses } = require('./data');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = gameStatuses.map(status => new GameStatus(status));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

const drop = async () => {
  await GameStatus.deleteMany({});
}

const test = async () => describe('GameStatus', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 3 game status documents', async function() {    
    await init();
    const docs = await GameStatus.find({});
    expect(docs.length).toBe(3);
  });
    
  it('Verify findByStatus(status) returns correct game status document', async function() {    
    let doc = await GameStatus.findByStatus('IN_PROGRESS');
    expect(doc.status).toBe('IN_PROGRESS');
    doc = await GameStatus.findByStatus('NOT_STARTED');
    expect(doc.status).toBe('NOT_STARTED');
    doc = await GameStatus.findByStatus('FINALIZED');
    expect(doc.status).toBe('FINALIZED');
  });

  it('Verify drop() deletes all game status documents', async function() {    
    await drop();
    const docs = await GameStatus.find({});
    expect(docs.length).toBe(0);
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}

module.exports = { init, drop, test};