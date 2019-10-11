const db = require('../../config/db');

const ACTION = process.env.DB_ACTION;

// inits
const { init: initUsers, drop: dropUsers } = require('../User/test');
const { init: initSuits, drop: dropSuits } = require('../Suit/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../CardRank/test');
const { init: initCards, drop: dropCards } = require('../Card/test');
const { init: initGameStatuses, drop: dropGameStatuses } = require('../GameStatus/test');
const { init: initGameConfigurations, drop: dropGameConfigurations } = require('../GameConfiguration/test');
const { init: initPoliticalRanks, drop: dropPoliticalRanks } = require('../PoliticalRank/test');
const { drop: dropPresidentsGames } = require('../PoliticalRank/test');


async function dbInit() {
  console.log('[Database] initializing database...');
  await db.connect();
  await Promise.all([
    initCardRanks(),
    initSuits()
  ]);
  await Promise.all([
    initCards(),
    initUsers(),
    initGameStatuses(),
    initPoliticalRanks()
  ]);
  await initGameConfigurations();
  await db.close();
  console.log('[Database] done');
};

async function dbDrop() {
  console.log('[Database] dropping database...');
  await db.connect();
  await Promise.all([
    dropCardRanks(),
    dropSuits(),
    dropCards(),
    dropUsers(),
    dropGameStatuses(),
    dropGameConfigurations(),
    dropPoliticalRanks(),
    dropPresidentsGames()
  ]);
  console.log('[Database] done');
};

(async () => {
  try {
    if (ACTION === 'init') {
      await dbInit();
    }
    if (ACTION === 'drop') {
      await dbDrop();
    }
  } catch (e) {
    console.log('[Database] db init/drop messed up')
  }
})();