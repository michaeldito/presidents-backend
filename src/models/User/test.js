const User = require('.');
const { users } = require('./data');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = users.map(user => new User(user));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

const drop = async () => {
  await User.deleteMany({});
}

const test = async () => describe('User', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 8 user documents', async function() {    
    await init();
    const docs = await User.find({});
    expect(docs.length).toBe(9);
  });

  it('Verify drop() deletes all user documents', async function() {    
    await drop();
    const docs = await User.find({});
    expect(docs.length).toBe(0);
  });

  describe.skip('findByUsername(username)', function() {    
  
    it('should return instance if successful', async function() {    
      const user = await User.findByUsername('bella');
      expect(user.username).toBe('bella');
    });

    it('should not return instance if unsuccessful', async function() {    

    });

  });

  describe.skip('findByCredentials(username, password)', function() {    
  
    it('should return instance if successful', async function() {    

    });

    it('should not return instance if unsuccessful', async function() {    

    });

  });

  describe('Validations', function() {    

    it('username is required', function() {
      const user = {
        password: 'password'
      }
      const instance = new User(user);
      const error = instance.validateSync();
      const message = 'A username is required for every user.';

      expect(error.errors['username'].message).toBe(message);
    });

    it('password is required', function() {    
      const user = {
        username: 'username'
      }
      const instance = new User(user);
      const error = instance.validateSync();
      const message = 'A password is required for every user.';

      expect(error.errors['password'].message).toBe(message);
    });

    it('token.access is required', function() {    
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


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}

module.exports = { init, drop, test};