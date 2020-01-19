import expect from 'expect';

import { 
	close, 
	connect} from '../../../config/db';
import PoliticalRank from '.';
import politicalRanks from './data';

export const init = async () => {
	const count = await PoliticalRank.countDocuments({});
	if (count === 8) return Promise.resolve();

	const instances = politicalRanks.map(rank => new PoliticalRank(rank));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await PoliticalRank.deleteMany({});
};

export const test = async () =>
	describe('PoliticalRank', function() {
		before(async function() {
			await db.connect();
		});

		after(async function() {
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 8 political rank documents', async function() {
				await init();
				const docs = await PoliticalRank.find({});
				expect(docs.length).toBe(8);
			});

			describe('validations', function() {
				it('name is required', async function() {
					const rank = {
						value: -1,
					};
					const instance = new PoliticalRank(rank);
					const message = 'A name is required to create a political rank.';
					const error = instance.validateSync();

					expect(error.errors.name.message).toBe(message);
				});

				it('name must be unique', async function() {
					const rank = {
						name: 'President',
						value: -1,
					};
					const instance = new PoliticalRank(rank);
					const message =
						'Error, expected `name` to be unique. Value: `President`';

					instance.save(error => {
						expect(error.errors.name.message).toBe(message);
					});
				});

				it('value is required', async function() {
					const rank = {
						name: 'some name',
					};
					const instance = new PoliticalRank(rank);
					const message = 'A value is required to create a political rank.';
					const error = instance.validateSync();

					expect(error.errors.value.message).toBe(message);
				});

				it('value must be unique', async function() {
					const rank = {
						name: 'some name',
						value: 1,
					};
					const instance = new PoliticalRank(rank);
					const message = 'Error, expected `value` to be unique. Value: `1`';

					instance.save(error => {
						expect(error.errors.value.message).toBe(message);
					});
				});
			});
		});

		describe('#findByName(name)', function() {
			it('verify it returns correct political rank document', async function() {
				let doc;
				for (const rank of politicalRanks) {
					doc = await PoliticalRank.findByName(rank.name);
					expect(doc.name).toBe(rank.name);
				}
			});
		});

		describe('#findByValue(value)', function() {
			it('verify it returns correct political rank document', async function() {
				let doc;
				for (const rank of politicalRanks) {
					doc = await PoliticalRank.findByValue(rank.value);
					expect(doc.value).toBe(rank.value);
				}
			});
		});

		describe('#getRanks(howMany)', function() {
			it('verify it returns correct number of ranks', async function() {
				const docs = await PoliticalRank.getRanks(8);
				expect(docs.length).toBe(8);
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all political rank documents', async function() {
				await drop();
				const docs = await PoliticalRank.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;