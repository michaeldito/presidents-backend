const User = require('.');
const { users } = require('./data');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  const count = await User.countDocuments({});
  if (count === 9) 
    return Promise.resolve();

  let instances = users.map(user => new User(user));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

const drop = async () => {
  await User.deleteMany({});
}

const test = async () => describe('User', async function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  describe('#init()', function() {    

    it('verify it initializes 9 user documents', async function() {    
      await init();
      const docs = await User.find({});
      expect(docs.length).toBe(9);
    });

    describe('validations', async function() {    

      it('username is required', async function() {
        const user = {
          password: 'password'
        }
        const instance = new User(user);
        const error = instance.validateSync();
        const message = 'A username is required to create a user.';

        expect(error.errors['username'].message).toBe(message);
      });

      it('username must be unique', async function() {
        const user = { 
          username: 'tommypastrami',
          password: 'cheese'
        }
        const instance = new User(user);
        const message = 'Error, expected `username` to be unique. Value: `tommypastrami`';
        
        instance.save(error => {
          expect(error.errors['username'].message).toBe(message);
        });
      });

      it('password is required', async function() {    
        const user = {
          username: 'username'
        }
        const instance = new User(user);
        const error = instance.validateSync();
        const message = 'A password is required to create a user.';

        expect(error.errors['password'].message).toBe(message);
      });

      it('token.access is required', async function() {    
        const user = {
          username: 'username',
          password: 'password',
          tokens: [{
            value: 'tokenvalue'
          }]
        };
        const instance = new User(user);
        const error = instance.validateSync();
        const message = 'An access is required for every user\'s token.';
        expect(error.errors['tokens.0.access'].message).toBe(message);
      });
      
      it('value is required', async function() {    
        const user = {
          username: 'username',
          password: 'password',
          tokens: [{
            access: 'access'
          }]
        };
        const instance = new User(user);
        const error = instance.validateSync();
        const message = 'A value is required for every user\'s token.';
        
        expect(error.errors['tokens.0.value'].message).toBe(message);
      });
      
    });

  });

  describe('findByUsername(username)', async function() {    
  
    it('should return instance if successful', async function() {    
      const doc = await User.findByUsername('bella');
      expect(doc.username).toBe('bella');
    });

    it('should not return instance if unsuccessful', async function() {    
      const doc = await User.findByUsername('foo');
      expect(doc).toBeFalsy();
    });

  });

  describe.skip('findByCredentials(username, password)', async function() {    
  
    it('should return instance if successful', async function() {    

    });

    it('should not return instance if unsuccessful', async function() {    

    });

  });

  describe('#drop()', async function() {    
    
    it('verify it deletes all user documents', async function() {    
      await drop();
      const docs = await User.find({});
      expect(docs.length).toBe(0);
    });

  });

});

module.exports = { init, drop, test};