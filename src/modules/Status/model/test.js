import expect from 'expect';

import { 
	close, 
	connect} from '../../../config/db';
import Status from '.';
import statuses from './data';

export const init = async () => {
	const count = await Status.countDocuments({ kind: 'Status' });
	if (count === 3) return Promise.resolve();

	const instances = statuses.map(status => new Status(status));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await Status.deleteMany({});
};

export const test = async () =>
	describe('Status', function() {
		before(async function() {
			await db.connect();
		});

		after(async function() {
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 3 status documents', async function() {
				await init();
				const docs = await Status.find({});
				expect(docs.length).toBe(3);
			});

			describe('validations', function() {
				it('value is required', async function() {
					const status = {};
					const instance = new Status(status);
					const error = instance.validateSync();
					const message = 'A Status must have a value to be created.';
					expect(error.errors.value.message).toBe(message);
				});

				it('value must be unique', async function() {
					const status = { value: 'A' };
					const instance = new Status(status);
					const message = 'Error, expected `value` to be unique. Value: `A`';

					instance.save(error => {
						expect(error.errors.value.message).toBe(message);
					});
				});
			});
		});

		describe('findByValue(value)', function() {
			it('Verify it returns correct status document', async function() {
				let doc = await Status.findByValue('A');
				expect(doc.value).toBe('A');
				doc = await Status.findByValue('B');
				expect(doc.value).toBe('B');
				doc = await Status.findByValue('C');
				expect(doc.value).toBe('C');
			});
		});

		describe('#drop()', function() {
			it('Verify it deletes all game status documents', async function() {
				await drop();
				const docs = await Status.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;