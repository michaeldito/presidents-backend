const User = require('.');
const { users } = require('./data');
const db = require('../../config/db');
const chai = require('chai');
const expect = require('expect')
const chaiexpect = chai.expect;

const init = async () => {
  const count = await User.countDocuments({});
  if (count === 9) 
    return Promise.resolve();
  
  let instances = users.map(user => new User(user));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await User.deleteMany({});
}

const test = async () => describe('User', async function() {
    
  before(async function() {
    await db.connect();
    await drop();
  });

  after(async function() {
    await db.close();
  });

  describe('#init()', async function() {    

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
          token: {
            value: 'tokenvalue'
          }
        };
        const instance = new User(user);
        const error = instance.validateSync();
        const message = 'An access is required for every user\'s token.';
        expect(error.errors['token.access'].message).toBe(message);
      });
      
      it('value is required', async function() {    
        const user = {
          username: 'username',
          password: 'password',
          token: {
            access: 'access'
          }
        };
        const instance = new User(user);
        const error = instance.validateSync();
        const message = 'A value is required for every user\'s token.';
        
        expect(error.errors['token.value'].message).toBe(message);
      });
      
    });

  });

  describe('#register(user)', async function() {    
  
    it('should hash the password and create a user', async function() {    
      const user = {
        username: 'mcdito13',
        password: '1234',
        email: 'mcdito13@gmail.com'
      };

      await User.register(user);
      const doc = await User.findOne({username: user.username});
      expect(doc.username).toBe('mcdito13');
      expect(doc.password[0]).toBe('$');
    });

  });


  describe('#findByUsername(username)', async function() {    
  
    it('should return instance if successful', async function() {    
      const doc = await User.findByUsername('bella');
      expect(doc.username).toBe('bella');
    });

    it('should not return instance if unsuccessful', async function() {    
      const doc = await User.findByUsername('foo');
      expect(doc).toBeFalsy();
    });

  });

  describe('findByCredentials(username, password)', async function() {    
  
    it('should return instance if successful', async function() {    
      const credentials = {
        username: 'mcdito13',
        password: '1234',
        email: 'mcdito13@gmail.com'
      };
      const doc = await User.findByCredentials(credentials);
      expect(doc).toBeTruthy();
    });

    it('should not return instance if unsuccessful', async function() {    
      const user = {
        username: 'mcdito13',
        password: '4321',
        email: 'mcdito13@gmail.com'
      };
      try {
        await User.findByCredentials(user.username, user.password);
      } catch (err) {
        expect(err.message).toBe('username doesn\'t exist.');
      }
    });

  });

  describe.skip('#findByToken(token)', async function() {    
    
    it('verify it does the right thing', async function() {    

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