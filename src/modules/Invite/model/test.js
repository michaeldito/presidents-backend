import expect from 'expect';
import mongoose from 'mongoose';

import { 
	close, 
	connect} from '../../../config/db';
import { 
	drop as dropCards, 
	init as initCards} from '../../Card/model/test';
import {
	drop as dropCardRanks,
	init as initCardRanks,
} from '../../CardRank/model/test';
import Game from '../../Game';
import { 
	drop as dropGames, 
	init as initGames} from '../../Game/model/test';
import {
	drop as dropConfigs,
	init as initConfigs,
} from '../../GameConfiguration/model/test';
import {
	drop as dropGameStatus,
	init as initGameStatus,
} from '../../GameStatus/model/test';
import InviteStatus from '../../InviteStatus';
import {
	drop as dropInviteStatuses,
	init as initInviteStatuses,
} from '../../InviteStatus/model/test';
import { 
	drop as dropSuits, 
	init as initSuits} from '../../Suit/model/test';
import User from '../../User';
import { 
	drop as dropUsers,	init as initUsers } from '../../User/model/test';
import Invite from './';

export const init = async () => {
	const count = await Invite.countDocuments({});
	if (count === 1) return Promise.resolve();

	const forUser = mongoose.Types.ObjectId();
	const seenByUser = false;
	const sentBy = forUser;
	const status = await InviteStatus.findByValue('PENDING');
	const game = mongoose.Types.ObjectId();
	const invite = { forUser, seenByUser, sentBy, status, game };

	await Invite.create(invite);
};

export const drop = async () => {
	await Invite.deleteMany({});
};

export const test = async () =>
	describe('Invite', function() {
		before(async function() {
			this.slow(20000);
			await db.connect();
			await Promise.all([
				initGameStatus(),
				initCardRanks(),
				initSuits(),
				initInviteStatuses(),
			]);
			await initCards();
			await initConfigs();
		});

		after(async function() {
			await dropCards();
			await dropCardRanks();
			await dropSuits();
			await dropGameStatus();
			await dropConfigs();
			await dropInviteStatuses();
			await db.close();
		});

		describe('#init()', function() {
			it('verify it initializes 1 invite document', async function() {
				await init();
				const docs = await Invite.find({});
				expect(docs.length).toBe(1);
			});

			describe('validations', function() {
				it('sentBy is required', async function() {
					const invite = {
						status: mongoose.Types.ObjectId(),
						game: mongoose.Types.ObjectId(),
					};
					const instance = new Invite(invite);
					const error = instance.validateSync();
					const message = 'A sentBy is required to create an invite.';

					expect(error.errors.sentBy.message).toBe(message);
				});

				it('status is required', async function() {
					const invite = {
						sentBy: mongoose.Types.ObjectId(),
						game: mongoose.Types.ObjectId(),
					};
					const instance = new Invite(invite);
					const error = instance.validateSync();
					const message = 'A status is required to create an invite.';

					expect(error.errors.status.message).toBe(message);
				});

				it('game is required', async function() {
					const invite = {
						sentBy: mongoose.Types.ObjectId(),
						status: mongoose.Types.ObjectId(),
					};
					const instance = new Invite(invite);
					const error = instance.validateSync();
					const message = 'A game is required to create an invite.';

					expect(error.errors.game.message).toBe(message);
				});
			});
		});

		describe('#drop()', function() {
			it('verify it deletes all invite documents', async function() {
				await drop();
				const docs = await Invite.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;