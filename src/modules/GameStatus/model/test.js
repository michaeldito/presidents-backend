import expect from 'expect';

import db from '../../../config/db';
import GameStatus from './';
import gameStatuses from './data';

export const init = async () => {
	const count = await GameStatus.countDocuments({});
	if (count === 3) return Promise.resolve();

	const instances = gameStatuses.map(status => new GameStatus(status));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await GameStatus.deleteMany({});
};

export const test = async () =>
	describe('GameStatus', function() {
		before(async function() {
			await db.connect();
		});

		after(async function() {
			await db.close();
		});

		it('Verify init() initializes 3 game status documents', async function() {
			await init();
			const docs = await GameStatus.find({});
			expect(docs.length).toBe(3);
		});

		it('Verify findByStatus(status) returns correct game status document', async function() {
			let doc = await GameStatus.findByValue('IN_PROGRESS');
			expect(doc.value).toBe('IN_PROGRESS');
			doc = await GameStatus.findByValue('NOT_STARTED');
			expect(doc.value).toBe('NOT_STARTED');
			doc = await GameStatus.findByValue('FINALIZED');
			expect(doc.value).toBe('FINALIZED');
		});

		it('Verify drop() deletes all game status documents', async function() {
			await drop();
			const docs = await GameStatus.find({});
			expect(docs.length).toBe(0);
		});
	});

const Test = { init, drop, test };

export default Test;
