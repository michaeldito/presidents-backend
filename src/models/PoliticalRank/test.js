const PoliticalRank = require('./');
const { politicalRanks } = require('./data');
const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = politicalRanks.map(rank => new PoliticalRank(rank));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await PoliticalRank.deleteMany({});
}

const test = async () => describe('PoliticalRank', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 8 political rank documents', async function() {    
    await init();
    const docs = await PoliticalRank.find({});
    expect(docs.length).toBe(8);
  });
    
  it('Verify findByName(name) returns correct political rank document', async function() {    
    let doc;
    for (let rank of politicalRanks) {
      doc = await PoliticalRank.findByName(rank.name)
      expect(doc.name).toBe(rank.name);
    }
  });

  it('Verify findByValue(value) returns correct political rank document', async function() {    
    let doc;
    for (let rank of politicalRanks) {
      doc = await PoliticalRank.findByValue(rank.value)
      expect(doc.value).toBe(rank.value);
    }
  });

  it('Verify getRanks(howMany) returns correct number of ranks', async function() {    
    const docs = await PoliticalRank.getRanks(8);
    expect(docs.length).toBe(8);
  });


  it('Verify drop() deletes all political rank documents', async function() {    
    await drop();
    const docs = await PoliticalRank.find({});
    expect(docs.length).toBe(0);
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}

module.exports = { init, drop, test};