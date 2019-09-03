const Status = require('.');
const { statuses } = require('./data');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = statuses.map(status => new Status(status));
  let promises = instances.map(instance => instance.save());
  await Promise.all(promises);
}

const drop = async () => {
  await Status.deleteMany({});
}

const test = async () => describe('Status', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 3 status documents', async function() {    
    await init();
    const docs = await Status.find({});
    expect(docs.length).toBe(3);
  });
    
  it('Verify findByValue(value) returns correct status document', async function() {    
    let doc = await Status.findByValue('A');
    expect(doc.value).toBe('A');
    doc = await Status.findByValue('B');
    expect(doc.value).toBe('B');
    doc = await Status.findByValue('C');
    expect(doc.value).toBe('C');
  });

  it('Verify drop() deletes all game status documents', async function() {    
    await drop();
    const docs = await Status.find({});
    expect(docs.length).toBe(0);
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}

module.exports = { init, drop, test};