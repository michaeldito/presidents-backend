const PoliticalRank = require('.');
const { politicalRanks } = require('./data');
const db = require('../../../config/db');
const expect = require('expect');


const init = async () => {
  const count = await PoliticalRank.countDocuments({});
  if (count === 8) 
    return Promise.resolve();

  let instances = politicalRanks.map(rank => new PoliticalRank(rank));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await PoliticalRank.deleteMany({});
}

const test = async () => describe('PoliticalRank', async function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  describe('#init()', async function() {    

    it('verify it initializes 8 political rank documents', async function() {    
      await init();
      const docs = await PoliticalRank.find({});
      expect(docs.length).toBe(8);
    });

    describe('validations', async function() {    

      it('name is required', async function() {
        const rank = {
          value: -1
        };
        const instance = new PoliticalRank(rank);
        const message = 'A name is required to create a political rank.';
        const error = instance.validateSync();

        expect(error.errors['name'].message).toBe(message);
      });

      it('name must be unique', async function() {
        const rank = {
          name: 'President',
          value: -1
        };
        const instance = new PoliticalRank(rank);
        const message = 'Error, expected `name` to be unique. Value: `President`';

        instance.save(error => {
          expect(error.errors['name'].message).toBe(message);
        });
      });

      it('value is required', async function() {    
        const rank = {
          name: 'some name'
        };
        const instance = new PoliticalRank(rank);
        const message = 'A value is required to create a political rank.';
        const error = instance.validateSync();
        
        expect(error.errors['value'].message).toBe(message);
      });
    
      it('value must be unique', async function() {
        const rank = {
          name: 'some name',
          value: 1
        };
        const instance = new PoliticalRank(rank);
        const message = 'Error, expected `value` to be unique. Value: `1`';

        instance.save(error => {
          expect(error.errors['value'].message).toBe(message);
        });
      });

    });

  });

  describe('#findByName(name)', async function() {    

    it('verify it returns correct political rank document', async function() {    
      let doc;
      for (let rank of politicalRanks) {
        doc = await PoliticalRank.findByName(rank.name)
        expect(doc.name).toBe(rank.name);
      }
    });

  });

  describe('#findByValue(value)', async function() {    

    it('verify it returns correct political rank document', async function() {    
      let doc;
      for (let rank of politicalRanks) {
        doc = await PoliticalRank.findByValue(rank.value)
        expect(doc.value).toBe(rank.value);
      }
    });

  });

  describe('#getRanks(howMany)', async function() {    

    it('verify it returns correct number of ranks', async function() {    
      const docs = await PoliticalRank.getRanks(8);
      expect(docs.length).toBe(8);
    });

  });

  describe('#drop()', async function() {    

    it('verify it deletes all political rank documents', async function() {    
      await drop();
      const docs = await PoliticalRank.find({});
      expect(docs.length).toBe(0);
    });

  });

});

module.exports = { init, drop, test};