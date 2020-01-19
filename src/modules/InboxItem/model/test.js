import expect from 'expect';
import mongoose from 'mongoose';

import { 
	close, 
	connect} from '../../../config/db';
import User from '../../User';
import { 
	drop as dropUsers, 
	init as initUsers} from '../../User/model/test';
import InboxItem from '.';

export const init = async () => {
	const count = await InboxItem.countDocuments({});
	if (count === 1) return Promise.resolve();

	const forUser = await User.findByUsername('tommypastrami');
	const seenByUser = false;
	const inboxItem = { forUser, seenByUser };

	await InboxItem.create(inboxItem);
};

const drop = async () => {
	await InboxItem.deleteMany({});
};

export const test = async () =>
	describe('InboxItem', function() {
		before(async function() {
			await db.connect();
			await initUsers();
		});

		after(async function() {
			await dropUsers();
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 1 inbox item document', async function() {
				await init();
				const docs = await InboxItem.find({});
				expect(docs.length).toBe(1);
			});

			describe('validations', function() {
				it('forUser is required', async function() {
					const item = { seenByUser: true };
					const instance = new InboxItem(item);
					const error = instance.validateSync();
					const message = 'A forUser is required to create an inbox item.';

					expect(error.errors.forUser.message).toBe(message);
				});

				it('seenByUser is required', async function() {
					const item = { forUser: mongoose.Types.ObjectId() };
					const instance = new InboxItem(item);
					const error = instance.validateSync();
					const message = 'A seenByUser is required to create an inbox item.';

					expect(error.errors.seenByUser.message).toBe(message);
				});
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all inbox item documents', async function() {
				await drop();
				const docs = await InboxItem.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;
