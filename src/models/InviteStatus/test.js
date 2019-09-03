const InviteStatus = require('./');
const { inviteStatuses } = require('./data');

const db = require('../../config/db');
const expect = require('expect');


const init = async () => {
  let instances = inviteStatuses.map(status => new InviteStatus(status));
  let promises = instances.map(instance => instance.save());
  return Promise.all(promises);
}

const drop = async () => {
  await InviteStatus.deleteMany({});
}

const test = async () => describe('InviteStatus', function() {
    
  before(async function() {
    await db.connect();
  });

  after(async function() {
    await db.close();
  });

  it('Verify init() initializes 3 invite status documents', async function() {    
    await init();
    const docs = await InviteStatus.find({});
    expect(docs.length).toBe(3);
  });
    
  it('Verify findByStatus(status) returns correct invite status document', async function() {    
    let doc = await InviteStatus.findByStatus('ACCEPTED');
    expect(doc.status).toBe('ACCEPTED');
    doc = await InviteStatus.findByStatus('DECLINED');
    expect(doc.status).toBe('DECLINED');
    doc = await InviteStatus.findByStatus('PENDING');
    expect(doc.status).toBe('PENDING');
  });

  it('Verify drop() deletes all invite status documents', async function() {    
    await drop();
    const docs = await InviteStatus.find({});
    expect(docs.length).toBe(0);
  });

});


const str = require.main.filename.split('/');
const isMochaRunning = str[str.length - 1] === 'mocha';

if (isMochaRunning){
  //test();
}

module.exports = { init, drop, test};