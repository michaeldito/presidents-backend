const { init: initUsers, drop: dropUsers } = require('../../User/model/test')
const InboxItem = require('.');
const User = require('../../User');
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

    it('verify it initializes 1 inbox item document', async function() {    
      await init();
      const docs = await InboxItem.find({});
      expect(docs.length).toBe(1);
    });

    describe('validations', async function() {    

      it('forUser is required', async function() {
        const item = { seenByUser: true };
        const instance = new InboxItem(item);
        const error = instance.validateSync();
        const message = 'A forUser is required to create an inbox item.';
  
        expect(error.errors['forUser'].message).toBe(message);
      });

      it('seenByUser is required', async function() {  
        const item = { forUser: mongoose.Types.ObjectId() };  
        const instance = new InboxItem(item);
        const error = instance.validateSync();
        const message = 'A seenByUser is required to create an inbox item.';
  
        expect(error.errors['seenByUser'].message).toBe(message);
      });
      
    });

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