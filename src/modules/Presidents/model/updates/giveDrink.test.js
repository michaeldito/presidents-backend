import expect from 'expect';

import Card from '../../../Card/model';
import GameConfiguration from '../../../GameConfiguration/model';
import GameStatus from '../../../GameStatus/model';
import PoliticalRank from '../../../PoliticalRank/model';
import User from '../../../User/model';
import Presidents from '../../model';


export default async () =>
	describe('#giveDrink()', function() {
		before(async function() {
			const status = await GameStatus.findByValue('IN_PROGRESS');
			const config = await GameConfiguration.findOne({ name: 'Presidents' });

			this.user1 = await User.findByUsername('tommypastrami');
			this.user2 = await User.findByUsername('bella');

			const user1 = this.user1._id;
			const user2 = this.user2._id;

			const currentPlayer = user2;
			const createdBy = currentPlayer;
			const name = 'giveDrink prez game';

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

			const player1 = {
				user: user1,
				joinedAt: new Date(),
				seatPosition: 0,
				hand: [],
				drinksReceived: [],
				drinksDrunk: 0,
				drinksSent: [],
				politicalRank: await PoliticalRank.findByValue(1),
			};

			const player2 = {
				user: user2,
				joinedAt: new Date(),
				seatPosition: 1,
				hand: [],
				drinksReceived: [],
				drinksSent: [],
				drinksDrunk: 0,
				politicalRank: await PoliticalRank.findByValue(2),
			};

			this.player1 = player1;
			this.player2 = player2;

			const game = {
				createdBy,
				name,
				status,
				config,
				rules,
				currentPlayer,
				handToBeat: [],
				rounds: [
					{
						turns: [],
					},
				],
				players: [player1, player2],
			};

			await Presidents.create(game);

			const game2 = {
				createdBy,
				name: 'giveDrink2 prez game',
				status,
				config,
				rules,
				currentPlayer,
				handToBeat: [],
				rounds: [
					{
						turns: [],
					},
				],
				players: [player1, player2],
			};

			game2.name = 'giveDrink2 prez game';
			delete game2.players[0].politicalRank;
			delete game2.players[1].politicalRank;

			await Presidents.create(game2);
		});

		describe('validations', function() {
			it('fromPlayer must out rank toPlayer', async function() {
				const doc = await Presidents.findOne({ name: 'giveDrink prez game' });
				const message =
					'fromPlayer must out rank toPlayer in order to give a drink';
				const fromUser = this.user2._id;
				const toUser = this.user1._id;

				try {
					await doc.giveDrink(fromUser, toUser);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('must wait til players have ranks to give a drink', async function() {
				const doc = await Presidents.findOne({ name: 'giveDrink2 prez game' });
				const message =
					'you must wait til all players have ranks to give drinks out';
				const fromUser = this.user2._id;
				const toUser = this.user1._id;

				try {
					await doc.giveDrink(fromUser, toUser);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('toPlayer has a drink from fromPlayer to drink already', async function() {
				const doc = await Presidents.findOne({ name: 'giveDrink2 prez game' });
				doc.players[0].politicalRank = await PoliticalRank.findByValue(1);
				doc.players[1].politicalRank = await PoliticalRank.findByValue(2);
				await doc.save();

				const fromUser = this.user1._id;
				const toUser = this.user2._id;
				const message =
					"toPlayer already has a drink to drink from fromPlayer. you can't give another";

				try {
					await doc.giveDrink(fromUser, toUser);
					await doc.giveDrink(fromUser, toUser);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});
		});

		describe('successful', function() {
			it('toPlayer has a drinkReceived & fromPlayer has a drinkSent', async function() {
				const doc = await Presidents.findOne({ name: 'giveDrink prez game' });
				const fromUser = this.user1._id;
				const toUser = this.user2._id;

				try {
					await doc.giveDrink(fromUser, toUser);
				} catch (err) {
					console.log(err);
				}

				const toPlayer = doc.players.find(
					player => player.user.toString() === toUser.toString(),
				);
				const fromPlayer = doc.players.find(
					player => player.user.toString() === fromUser.toString(),
				);

				expect(toPlayer.drinksReceived.length).toBe(1);
				expect(fromPlayer.drinksSent.length).toBe(1);
			});
		});
	});
