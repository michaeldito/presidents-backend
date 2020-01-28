import expect from 'expect';

import db from '../../../config/db';
import Card from '../../../modules/Card/model';
import {
	drop as dropCards,
	init as initCards,
} from '../../../modules/Card/model/test';
import CardRank from '../../../modules/CardRank/model';
import {
	drop as dropCardRanks,
	init as initCardRanks,
} from '../../../modules/CardRank/model/test';
import {
	drop as dropSuits,
	init as initSuits,
} from '../../../modules/Suit/model/test';
import GameConfiguration from './';
import gameConfigurations from './data';

export const init = async () => {
	const count = await GameConfiguration.countDocuments({});
	if (count === 3) return Promise.resolve();

	const deck = await Card.getDeck();
	const configs = gameConfigurations.map(config => ({ ...config, deck }));
	const instances = configs.map(config => new GameConfiguration(config));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await GameConfiguration.deleteMany({});
};

export const test = async () =>
	describe('GameConfiguration', function() {
		before(async function() {
			await db.connect();
			await initCardRanks();
			await initSuits();
			await initCards();
		});

		after(async function() {
			await dropCards();
			await dropCardRanks();
			await dropSuits();
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 3 game configuration documents', async function() {
				await init();
				const docs = await GameConfiguration.find({});
				expect(docs.length).toBe(3);
			});

			describe('validations', function() {
				it('name is required', async function() {
					const card = await Card.findOne({});
					const config = {
						maxPlayers: 1,
						deck: [card],
						numDecks: 1,
					};
					const instance = new GameConfiguration(config);
					const error = instance.validateSync();
					const message = 'A name is required for every game configuration.';

					expect(error.errors.name.message).toBe(message);
				});

				it('name must be unique', async function() {
					const card = await Card.findOne({});
					const config = {
						name: 'Presidents',
						maxPlayers: 1,
						deck: [card],
						numDecks: 1,
					};
					const instance = new GameConfiguration(config);
					const message =
						'Error, expected `name` to be unique. Value: `Presidents`';

					instance.save(error => {
						expect(error.errors.name.message).toBe(message);
					});
				});

				it('maxPlayers is required', async function() {
					const card = await Card.findOne({});
					const config = {
						name: 'name',
						deck: [card],
						numDecks: 1,
					};
					const instance = new GameConfiguration(config);
					const error = instance.validateSync();
					const message =
						'A maxPlayers field is required for every game configuration.';

					expect(error.errors.maxPlayers.message).toBe(message);
				});

				it('maxPlayers must be >= minPlayers', async function() {});

				it('minPlayers must be <= maxPlayers', async function() {});

				it('deck must not be empty', async function() {
					const config = {
						name: 'name',
						maxPlayers: 1,
						numDecks: 1,
						deck: [],
					};
					const instance = new GameConfiguration(config);
					const message = 'empty deck';
					instance.validate(error => {
						expect(error.errors.deck.reason.message).toBe(message);
					});
				});

				it('deck must be array of Card instances', async function() {
					const rank = await CardRank.findOne({});
					const card = await Card.findOne({});
					const config = {
						name: 'name',
						maxPlayers: 1,
						numDecks: 1,
						deck: [rank, card],
					};
					const instance = new GameConfiguration(config);
					const message = 'objectId does not reference a card';
					instance.validate(error => {
						expect(error.errors.deck.reason.message).toBe(message);
					});
				});

				it('numDecks is required', async function() {
					const card = await Card.findOne({});
					const config = {
						name: 'name',
						maxPlayers: 1,
						deck: [card],
					};
					const instance = new GameConfiguration(config);
					const error = instance.validateSync();
					const message =
						'A numDecks field is required for every game configuration.';

					expect(error.errors.numDecks.message).toBe(message);
				});
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all game configuration documents', async function() {
				await drop();
				const docs = await GameConfiguration.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;