const db = require('../config/db');

const ACTION = process.env.DB_ACTION;

// inits
const { init: initUsers, drop: dropUsers } = require('../services/User/model/test');
const { init: initSuits, drop: dropSuits } = require('../services/Suit/model/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../services/CardRank/model/test');
const { init: initCards, drop: dropCards } = require('../services/Card/model/test');
const { init: initGameStatuses, drop: dropGameStatuses } = require('../services/GameStatus/model/test');
const { init: initGameConfigurations, drop: dropGameConfigurations } = require('../services/GameConfiguration/model/test');
const { init: initPoliticalRanks, drop: dropPoliticalRanks } = require('../services/PoliticalRank/model/test');
const { drop: dropPresidentsGames } = require('../services/Presidents/model/test');


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
  await db.close();
  console.log('[Database] done');
};

async function runCommand() {
  console.log('[Database] running command: initGameStatuses()');
  await db.connect();
  await initGameStatuses();
  await db.close();
  console.log('[Database] done');
}

(async () => {
  try {
    if (ACTION === 'init') {
      await dbInit();
    }
    if (ACTION === 'drop') {
      await dbDrop();
    }
    if (ACTION === 'command') {
      await runCommand();
    }
  } catch (e) {
    console.log('[Database] db init/drop messed up')
  }
})();