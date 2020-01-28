import expect from 'expect';

import db from '../../../config/db';
import Suit from '.';
import suits from './data';

export const init = async () => {
	const count = await Suit.countDocuments({});
	if (count === 4) return Promise.resolve();

	const instances = suits.map(suit => new Suit(suit));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await Suit.deleteMany({});
};

export const test = async () =>
	describe('Suit', function() {
		before(async function() {
			await db.connect();
		});

		after(async function() {
			await db.close();
		});

		describe('#init()', function() {
			it('verify init() initializes 4 suit documents', async function() {
				await init();
				const docs = await Suit.find({});
				expect(docs.length).toBe(4);
			});

			describe('validations', function() {
				it('name is required', async function() {
					const suit = {
						color: 'Black',
						character: '1234',
						value: 0,
					};
					const instance = new Suit(suit);
					const error = instance.validateSync();
					const message = 'A name is required for every suit.';

					expect(error.errors.name.message).toBe(message);
				});

				it('name must be unique', async function() {
					const suit = {
						name: 'Diamonds',
						color: 'Red',
						character: '\u2666',
						value: 1,
					};
					const instance = new Suit(suit);
					const message =
						'Error, expected `name` to be unique. Value: `Diamonds`';

					instance.save(error => {
						expect(error.errors.name.message).toBe(message);
					});
				});

				it('color is required', async function() {
					const suit = {
						name: 'Clubs',
						character: '1234',
						value: 0,
					};
					const instance = new Suit(suit);
					const error = instance.validateSync();
					const message = 'A color is required for every suit.';

					expect(error.errors.color.message).toBe(message);
				});

				it('character is required', async function() {
					const suit = {
						name: 'Clubs',
						color: 'Black',
						value: 0,
					};
					const instance = new Suit(suit);
					const error = instance.validateSync();
					const message = 'A character is required for every suit.';

					expect(error.errors.character.message).toBe(message);
				});

				it('character must be unique', async function() {
					const suit = {
						name: 'Diamonds',
						color: 'Red',
						character: '\u2666',
						value: 1,
					};
					const instance = new Suit(suit);
					const message =
						'Error, expected `character` to be unique. Value: `\u2666`';

					instance.save(error => {
						expect(error.errors.character.message).toBe(message);
					});
				});

				it('value is required', async function() {
					const suit = {
						name: 'Clubs',
						color: 'Black',
						character: '1234',
					};
					const instance = new Suit(suit);
					const error = instance.validateSync();
					const message = 'A value is required for every suit.';

					expect(error.errors.value.message).toBe(message);
				});

				it('value must be unique', async function() {
					const suit = {
						name: 'Diamonds',
						color: 'Red',
						character: '\u2666',
						value: 1,
					};
					const instance = new Suit(suit);
					const message = 'Error, expected `value` to be unique. Value: `1`';

					instance.save(error => {
						expect(error.errors.value.message).toBe(message);
					});
				});
			});
		});

		describe('#findByName(name)', function() {
			it('verify it returns correct suit document', async function() {
				let doc = await Suit.findByName('Hearts');
				expect(doc.name).toBe('Hearts');
				doc = await Suit.findByName('Spades');
				expect(doc.name).toBe('Spades');
				doc = await Suit.findByName('Diamonds');
				expect(doc.name).toBe('Diamonds');
				doc = await Suit.findByName('Clubs');
				expect(doc.name).toBe('Clubs');
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all documents', async function() {
				await drop();
				const docs = await Suit.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;