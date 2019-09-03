const { init: initUsers, drop: dropUsers } = require('../User/test');
const InboxItem = require('./');
const User = require('../User');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const forUser = await User.findByUsername('tommypastrami');
  const seenByUser = false;
  const inboxItem = { forUser, seenByUser };
  
  await InboxItem.create(inboxItem);
}

const drop = async () => {
  await InboxItem.deleteMany({});
}

const test = async () => describe('InboxItem', function() {
    
  before(async function() {
    await db.connect();
    await initUsers();
  });

  after(async function() {
    await dropUsers();
    await db.close();
  });

  it('Verify init() initializes 1 inbox item document', async function() {    
    await init();
    const docs = await InboxItem.find({});
    expect(docs.length).toBe(1);
  });
    

  it('Verify drop() deletes all inbox item documents', async function() { 
    await drop();   
    const docs = await InboxItem.find({});
    expect(docs.length).toBe(0);
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}



module.exports = { init, drop, test};