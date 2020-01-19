import {
	close, 
	connect} from '../config/db';

const ACTION = process.env.DB_ACTION;

// inits
import {
	drop as dropCards,
	init as initCards,
} from '../modules/Card/model/test';
import {
	drop as dropCardRanks,
	init as initCardRanks,
} from '../modules/CardRank/model/test';
import {
	drop as dropGameConfigurations,
	init as initGameConfigurations,
} from '../modules/GameConfiguration/model/test';
import {
	drop as dropGameStatuses,
	init as initGameStatuses,
} from '../modules/GameStatus/model/test';
import {
	drop as dropPoliticalRanks,
	init as initPoliticalRanks,
} from '../modules/PoliticalRank/model/test';
import {
	drop as dropPresidentsGames,
} from '../modules/Presidents/model/test';
import {
	drop as dropSuits,
	init as initSuits,
} from '../modules/Suit/model/test';
import {
	drop as dropUsers,
	init as initUsers,
} from '../modules/User/model/test';

async function dbInit() {
	console.log('[Database] initializing database...');
	await connect();
	await Promise.all([initCardRanks(), initSuits()]);
	await Promise.all([
		initCards(),
		initUsers(),
		initGameStatuses(),
		initPoliticalRanks(),
	]);
	await initGameConfigurations();
	await close();
	console.log('[Database] done');
}

async function dbDrop() {
	console.log('[Database] dropping database...');
	await connect();
	await Promise.all([
		dropCardRanks(),
		dropSuits(),
		dropCards(),
		dropUsers(),
		dropGameStatuses(),
		dropGameConfigurations(),
		dropPoliticalRanks(),
		dropPresidentsGames(),
	]);
	await close();
	console.log('[Database] done');
}

async function runCommand() {
	console.log('[Database] running command: initGameStatuses()');
	await connect();
	await initGameStatuses();
	await close();
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
		console.log('[Database] db init/drop messed up');
		console.log(e);
	}
})();
