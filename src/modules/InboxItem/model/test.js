const { init: initUsers, drop: dropUsers } = require('../../User/model/test')
const InboxItem = require('.');
const { Model: User } = require('../../User');
const mongoose = require('mongoose');
const db = require('../../../config/db');
const expect = require('expect');


const init = async () => {
  const count = await InboxItem.countDocuments({});
  if (count === 1) 
    return Promise.resolve();

  const forUser = await User.findByUsername('tommypastrami');
  const seenByUser = false;
  const inboxItem = { forUser, seenByUser };
  
  await InboxItem.create(inboxItem);
}

const drop = async () => {
  await InboxItem.deleteMany({});
}

const test = async () => describe('InboxItem', async function() {
    
  before(async function() {
    await db.connect();
    await initUsers();
  });

  after(async function() {
    await dropUsers();
    await db.close();
  });

  describe('#init()', async function() {    

  });
      

  describe('#drop()', async function() {    

    it('verify it deletes all inbox item documents', async function() { 
      await drop();   
      const docs = await InboxItem.find({});
      expect(docs.length).toBe(0);
    });
    
  });
    


});

module.exports = { init, drop, test};