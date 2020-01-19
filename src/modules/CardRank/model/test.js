import expect from 'expect';

import { 
	close, 
	connect} from '../../../config/db';
import CardRank from '.';
import cardRanks from './data';

export const init = async () => {
	const count = await CardRank.countDocuments({});
	if (count === 13) return Promise.resolve();

	const instances = cardRanks.map(cardRank => new CardRank(cardRank));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await CardRank.deleteMany({});
};

export const test = async () =>
	describe('CardRank', function() {
		before(async function() {
			await db.connect();
			await drop();
		});

		after(async function() {
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 13 documents', async function() {
				await init();
				const docs = await CardRank.find({});
				expect(docs.length).toBe(13);
			});

			describe('validations', function() {
				it('name is required', async function() {
					const cardRank = {
						character: '3',
						value: 3,
					};
					const instance = new CardRank(cardRank);
					const error = instance.validateSync();
					const message = 'A name is required for every card rank.';

					expect(error.errors.name.message).toBe(message);
				});

				it('name must be unique', async function() {
					const cardRank = {
						name: '2',
						character: 'random',
						value: 22,
					};
					const instance = new CardRank(cardRank);
					const message = 'Error, expected `name` to be unique. Value: `2`';

					instance.save(error => {
						expect(error.errors.name.message).toBe(message);
					});
				});

				it('character is required', async function() {
					const cardRank = {
						name: 'Jack',
						value: 11,
					};
					const instance = new CardRank(cardRank);
					const error = instance.validateSync();
					const message = 'A character is required for every card rank.';

					expect(error.errors.character.message).toBe(message);
				});

				it('character must be unique', async function() {
					const cardRank = {
						name: '22',
						character: '2',
						value: 22,
					};
					const instance = new CardRank(cardRank);
					const message = 'Error, expected `character` to be unique. Value: `2`';

					instance.save(error => {
						expect(error.errors.character.message).toBe(message);
					});
				});

				it('value is required', async function() {
					const cardRank = {
						name: 'Jack',
						character: 'J',
					};
					const instance = new CardRank(cardRank);
					const error = instance.validateSync();
					const message = 'A value is required for every card rank.';

					expect(error.errors.value.message).toBe(message);
				});

				it('value must be unique', async function() {
					const cardRank = {
						name: '22',
						character: '22',
						value: 2,
					};
					const instance = new CardRank(cardRank);
					const message = 'Error, expected `value` to be unique. Value: `2`';

					instance.save(error => {
						expect(error.errors.value.message).toBe(message);
					});
				});
			});
		});

		describe('#findByChar(char)', function() {
			it('verify it returns correct card rank document', async function() {
				const doc = await CardRank.findByChar('A');
				expect(doc.character).toBe('A');
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all card rank documents', async function() {
				await drop();
				const docs = await CardRank.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

export default Test;
