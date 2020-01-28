import chai from 'chai';
import expect from 'expect';

import db from '../../../config/db';
import User from '.';
import users from './data';

const chaiexpect = chai.expect;

export const init = async () => {
	const count = await User.countDocuments({});
	if (count === 9) return Promise.resolve();

	const instances = users.map(user => new User(user));
	const promises = instances.map(instance => instance.save());
	await Promise.all(promises);
};

export const drop = async () => {
	await User.deleteMany({});
};

export const test = async () =>
	describe('User', function() {
		before(async function() {
			await db.connect();
			await drop();
		});

		after(async function() {
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 9 user documents', async function() {
				await init();
				const docs = await User.find({});
				expect(docs.length).toBe(9);
			});

			describe('validations', function() {
				it('username is required', async function() {
					const user = {
						password: 'password',
					};
					const instance = new User(user);
					const error = instance.validateSync();
					const message = 'A username is required to create a user.';

					expect(error.errors.username.message).toBe(message);
				});

				it('username must be unique', async function() {
					const user = {
						username: 'tommypastrami',
						password: 'cheese',
					};
					const instance = new User(user);
					const message =
						'Error, expected `username` to be unique. Value: `tommypastrami`';

					instance.save(error => {
						expect(error.errors.username.message).toBe(message);
					});
				});

				it('password is required', async function() {
					const user = {
						username: 'username',
					};
					const instance = new User(user);
					const error = instance.validateSync();
					const message = 'A password is required to create a user.';

					expect(error.errors.password.message).toBe(message);
				});
			});
		});

		describe('#register(user)', function() {
			it('should hash the password and create a user', async function() {
				const user = {
					username: 'mcdito13',
					password: '1234',
					email: 'mcdito13@gmail.com',
				};

				await User.register(user);
				const doc = await User.findOne({ username: user.username });
				expect(doc.username).toBe('mcdito13');
				expect(doc.password[0]).toBe('$');
			});
		});

		describe('#findByUsername(username)', function() {
			it('should return instance if successful', async function() {
				const doc = await User.findByUsername('bella');
				expect(doc.username).toBe('bella');
			});

			it('should not return instance if unsuccessful', async function() {
				const doc = await User.findByUsername('foo');
				expect(doc).toBeFalsy();
			});
		});

		describe('findByCredentials(username, password)', function() {
			it('should return instance if successful', async function() {
				const credentials = {
					username: 'mcdito13',
					password: '1234',
					email: 'mcdito13@gmail.com',
				};
				const doc = await User.findByCredentials(credentials);
				expect(doc).toBeTruthy();
			});

			it('should not return instance if unsuccessful', async function() {
				const user = {
					username: 'mcdito13',
					password: '4321',
					email: 'mcdito13@gmail.com',
				};
				try {
					await User.findByCredentials(user.username, user.password);
				} catch (err) {
					expect(err.message).toBe("username doesn't exist.");
				}
			});
		});

		describe('#findByToken(token)', function() {
			it('verify it does the right thing', async function() {});
		});

		describe('#drop()', function() {
			it('verify it deletes all user documents', async function() {
				await drop();
				const docs = await User.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;