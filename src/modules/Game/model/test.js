import expect from 'expect';

import db from '../../../config/db';
import { 
	drop as dropCards, 
	init as initCards} from '../../Card/model/test';
import {
	drop as dropCardRanks,
	init as initCardRanks,
} from '../../CardRank/model/test';
import GameConfiguration from '../../GameConfiguration/model';
import {
	drop as dropGameConfigurations,
	init as initGameConfigurations,
} from '../../GameConfiguration/model/test';
import GameStatus from '../../GameStatus/model';
import {
	drop as dropGameStatuses,
	init as initGameStatuses,
} from '../../GameStatus/model/test';
import { 
	drop as dropSuits, 
	init as initSuits	} from '../../Suit/model/test';
import User from '../../User/model';
import { drop as dropUsers,init as initUsers } from '../../User/model/test';
import Game from '.';

export const init = async () => {
	const count = await Game.countDocuments({});
	if (count === 1) return Promise.resolve();

	const status = await GameStatus.findByValue('NOT_STARTED');
	const config = await GameConfiguration.findOne({ name: 'test-game' });
	const currentPlayer = await User.findByUsername('tommypastrami');
	const createdBy = currentPlayer;
	const name = 'test game';
	const game = {
		name,
		createdBy,
		currentPlayer,
		status,
		config,
		currentPlayer,
	};

	await Game.create(game);
};

export const drop = async () => {
	await Game.deleteMany({});
};

export const test = async () =>
	describe('Game', function() {
		before(async function() {
			this.timeout(20000);
			await db.connect();
			await initCardRanks();
			await initSuits();
			await initCards();
			await Promise.all([
				initUsers(),
				initGameStatuses(),
				initGameConfigurations(),
			]);
		});

		after(async function() {
			await Promise.all([
				dropCards(),
				dropSuits(),
				dropCardRanks(),
				dropUsers(),
				dropGameStatuses(),
				dropGameConfigurations(),
			]);
			await db.close();
		});

		describe('#init()', function() {
			it('verify it creates 1 game document', async function() {
				await init();
				const docs = await Game.find({});
				// console.log(docs)
				expect(docs.length).toBe(1);
			});

			describe('validations', function() {
				before(async function() {
					const status = await GameStatus.findByValue('NOT_STARTED');
					const config = await GameConfiguration.findOne({ name: 'test-game' });
					const currentPlayer = await User.findByUsername('tommypastrami');
					const createdBy = currentPlayer;
					const name = 'test game init validations';
					this.game = {
						name,
						createdBy,
						currentPlayer,
						status,
						config,
						currentPlayer,
					};
				});

				it('name is required', async function() {
					const { name, ...rest } = this.game;
					const g1 = rest;
					const instance = new Game(g1);
					const error = instance.validateSync();
					const message = 'A name is required to create a game.';

					expect(error.errors.name.message).toBe(message);
				});

				it('name must be unique', async function() {
					const { name, ...rest } = this.game;
					const g1 = rest;
					g1.name = 'test game'; // used above in init
					const instance = new Game(g1);
					const message =
						'Error, expected `name` to be unique. Value: `test game`';

					instance.save(error => {
						expect(error.errors.name.message).toBe(message);
					});
				});

				it('status is required', async function() {
					const { status, ...rest } = this.game;
					const g1 = rest;
					const instance = new Game(g1);
					const error = instance.validateSync();
					const message = 'A status is required to create a game.';

					expect(error.errors.status.message).toBe(message);
				});

				it('config is required', async function() {
					const { config, ...rest } = this.game;
					const g1 = rest;
					const instance = new Game(g1);
					const error = instance.validateSync();
					const message = 'A config is required to create a game.';

					expect(error.errors.config.message).toBe(message);
				});

				it('createdBy is required', async function() {
					const { createdBy, ...rest } = this.game;
					const g1 = rest;
					const instance = new Game(g1);
					const error = instance.validateSync();
					const message = 'A createdBy is required to create a game.';

					expect(error.errors.createdBy.message).toBe(message);
				});
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all game documents', async function() {
				await drop();
				const docs = await Game.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;
