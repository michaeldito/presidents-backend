import expect from 'expect';
import mongoose from 'mongoose';

import Presidents from '../';
import Card from '../../../Card/model';
import GameConfiguration from '../../../GameConfiguration/model';
import GameStatus from '../../../GameStatus/model';
import PoliticalRank from '../../../PoliticalRank/model';
import User from '../../../User/model';

export default async () =>
	describe('#shouldProcessTurn()', function() {
		before(async function() {
			const status = await GameStatus.findByValue('NOT_STARTED');
			const config = await GameConfiguration.findOne({ name: 'Presidents' });
			const currentPlayer = await User.findByUsername('tommypastrami');
			const createdBy = currentPlayer;
			const user = currentPlayer;
			const name = 'shd process game';
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
			const winner = user;
			const politicalRank = await PoliticalRank.findByName('President');
			const nextGameRank = politicalRank;
			const drinksDrunk = 0;
			const drinksReceived = [{ createdAt: new Date(), sentBy: user }];
			const drinksSent = [{ createdAt: new Date(), sentTo: user }];

			const game = {
				createdBy,
				name,
				status,
				config,
				rules,			
			};

			await Presidents.create(game);
		});
		
		after(async function() {
			await Presidents.findOneAndDelete({name: 'shd process game'});
		});

		describe('true', function() {
			it('current hand is better', async function() {
				let doc = await Presidents.findOne({ name: 'shd process game'});
				const user1 = await User.findByUsername('tommypastrami');
				const user2 = await User.findByUsername('jethro');
				doc = await doc.join(user1);
				doc = await doc.join(user2);
				doc = await doc.initialize();
				doc = await doc.initializeNextRound();
				const threeClubs = await Card.findOne({ shortHand: '3Clubs' });
				const sevenHearts = await Card.findOne({ shortHand: '7Hearts' });
				let turn = {
					user: doc.currentPlayer,
					cardsPlayed: [threeClubs],
					wasPassed: false,
					wasSkipped: false,
					didCauseSkips: false,
					skipsRemaining: 0,
					endedRound: false
				};
				doc = await doc.processTurn(turn);
				turn = {
					user: doc.currentPlayer,
					cardsPlayed: [sevenHearts],
					wasPassed: false,
				};
				let shouldProcess;
				try {
					shouldProcess = await doc.shouldProcessTurn(turn);
				} catch (err) {
					console.log(err);
				}
				expect(shouldProcess).toBeTruthy();
			});
		});

		describe('false', function() {
			it('not your turn', async function() {
				let doc = await Presidents.findOne({ name: 'shd process game'});
				const turn = {
					user: '1234',
					cardsPlayed: [],
					wasPassed: true,
				};
				let shouldProcess;
				try {
					shouldProcess = await doc.shouldProcessTurn(turn);
				} catch (err) {
					expect(err.message).toBe(
						`Unable to process turn. It is not your turn.`,
					);
				}
			});

			it('invalid cards', async function() {
				const sevenHearts = await Card.findOne({ shortHand: '7Hearts' });
				const eightHearts = await Card.findOne({ shortHand: '8Hearts' });
				let doc = await Presidents.findOne({ name: 'shd process game'});
				const turn = {
					user: doc.currentPlayer,
					cardsPlayed: [sevenHearts, eightHearts],
					wasPassed: true,
				};
				let shouldProcess;
				try {
					shouldProcess = await doc.shouldProcessTurn(turn);
				} catch (err) {
					expect(err.message).toBe(
						`Unable to process turn. The cards selected are invalid.`,
					);
				}
			});

			it('cards are not better', async function() {
				const fourClubs = await Card.findOne({ shortHand: '4Clubs' });
				let doc = await Presidents.findOne({ name: 'shd process game'});
				let turn = {
					user: doc.currentPlayer,
					cardsPlayed: [fourClubs],
					wasPassed: false,
					wasSkipped: false,
					didCauseSkips: false,
					skipsRemaining: 0,
					endedRound: false
				};
				doc = await doc.processTurn(turn);
				const threeSpades = await Card.findOne({ shortHand: '3Spades' });
				turn = {
					user: doc.currentPlayer,
					cardsPlayed: [threeSpades],
					wasPassed: false
				};
				let shouldProcess;
				try {
					shouldProcess = await doc.shouldProcessTurn(turn);
				} catch (err) {
					expect(err.message).toBe(
						`Unable to process turn. The rank of the selected cards does not beat the previous turns.`
					);
				}
			});
		});
	});
