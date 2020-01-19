import expect from 'expect';
import mongoose from 'mongoose';

import Card from '../../../Card/model';
import GameConfiguration from '../../../GameConfiguration/model';
import GameStatus from '../../../GameStatus/model';
import PoliticalRank from '../../../PoliticalRank/model';
import User from '../../../User/model';
import Presidents from '../../model';

export default async () =>
	describe('#getNextPlayer()', function() {
		before(async function() {
			const status = await GameStatus.findByValue('NOT_STARTED');
			const config = await GameConfiguration.findOne({ name: 'Presidents' });
			const user1 = mongoose.Types.ObjectId();
			const createdBy = user1;
			const name = 'get next player prez game';
			const rules = {
				doubleSkips: false,
				scumStarts: false,
				scumHandsTwo: false,
				oneEyedJacksAndKingOfHearts: false,
				reversePresidentScumTrade: false,
				presidentDeals: false,
				goLow: false,
				equalNumber: false,
				noEndOnBomb: false,
				tripleSixes: false,
				passOut: false,
				fourInARow: false,
				larryPresidents: true,
			};
			const player = {
				user: user1,
				seatPosition: 0,
				drinksDrunk: 0,
				drinksReceived: [],
				drinksSent: [],
			};

			const game = {
				createdBy,
				name,
				status,
				config,
				rules,
				players: [player],
			};

			await Presidents.create(game);
		});

		describe('successful', function() {
			before(async function() {
				const user2 = mongoose.Types.ObjectId();
				const user3 = mongoose.Types.ObjectId();
				const user4 = mongoose.Types.ObjectId();
				const user5 = mongoose.Types.ObjectId();
				const user6 = mongoose.Types.ObjectId();
				const user7 = mongoose.Types.ObjectId();
				const user8 = mongoose.Types.ObjectId();
				const users = [user2, user3, user4, user5, user6, user7, user8];
				const doc = await Presidents.findOne({
					name: 'get next player prez game',
				});
				try {
					for (const user of users) {
						await doc.join(user);
					}
					await doc.initialize();
				} catch (err) {
					console.log(err);
				}
				expect(doc.players.length).toBe(8);
			});

			it('when called 8 times it `wraps around` the players array (length 8)', async function() {
				const doc = await Presidents.findOne({
					name: 'get next player prez game',
				});
				const current = doc.currentPlayer.toString();
				let i = 8;
				// console.log(`start ${current}`)
				while (i > 0) {
					const next = await doc.getNextPlayer();
					doc.currentPlayer = next.user;
					// console.log(`next ${doc.currentPlayer}`)
					await doc.save();
					i--;
				}
				// console.log('done')
				const newCurrent = doc.currentPlayer.toString();
				// console.log(`started with ${current}`)
				// console.log(`finished with ${newCurrent}`)
				expect(current).toBe(newCurrent);
			});
		});
	});
