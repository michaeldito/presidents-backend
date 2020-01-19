import expect from 'expect';
import mongoose from 'mongoose';

import Card from '../../../Card/model';
import GameConfiguration from '../../../GameConfiguration/model';
import GameStatus from '../../../GameStatus/model';
import PoliticalRank from '../../../PoliticalRank/model';
import User from '../../../User/model';
import Presidents from '../../model';

export default async () =>
	describe('#initialize()', function() {
		before(async function() {
			const status = await GameStatus.findByValue('IN_PROGRESS');
			const config = await GameConfiguration.findOne({ name: 'Presidents' });
			const currentPlayer = await User.findByUsername('tommypastrami');
			const createdBy = currentPlayer;
			const cardsPlayed = await Card.find({ shortHand: '3Clubs' });
			const hand = await Card.find({}).limit(5);
			const user = currentPlayer;
			const name = 'initialize prez game';
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
			const player = {
				user,
				joinedAt: new Date(),
				seatPosition: 1,
				hand,
				politicalRank,
				nextGameRank,
				drinksDrunk,
				drinksReceived,
				drinksSent,
			};

			const game = {
				winner,
				createdBy,
				name,
				status,
				config,
				rules,
				currentPlayer,
				rounds: [
					{
						startedAt: new Date(),
						turns: [
							{
								wasPassed: false,
								wasSkipped: false,
								didCauseSkips: false,
								skipsRemaining: 0,
								endedRound: false,
								user,
								takenAt: new Date(),
								cardsPlayed,
							},
						],
					},
				],
				players: [player],
			};

			await Presidents.create(game);
		});

		describe('validations', function() {
			it('cannot start a game that is in progress', async function() {
				const doc = await Presidents.findOne({ name: 'initialize prez game' });
				const message = 'Unable to start game. It is already in progress.';

				try {
					await doc.initialize();
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('cannot start a game that has finished', async function() {
				let doc = await Presidents.findOne({ name: 'initialize prez game' });
				doc.status = await GameStatus.findByValue('FINALIZED');
				await doc.save();

				doc = await Presidents.findOne({ name: 'initialize prez game' });
				const message = 'Unable to start game. It has already finished.';

				try {
					await doc.initialize();
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('cannot start a game that does not have minimum number of players', async function() {
				let doc = await Presidents.findOne({ name: 'initialize prez game' });
				doc.status = await GameStatus.findByValue('NOT_STARTED');
				await doc.save();

				doc = await Presidents.findOne({ name: 'initialize prez game' });
				const message = 'Unable to start game. Minimum number of players is 2.';

				try {
					await doc.initialize();
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});
		});

		describe('successful', function() {
			before(async function() {
				const status = await GameStatus.findByValue('NOT_STARTED');
				const config = await GameConfiguration.findOne({ name: 'Presidents' });
				const currentPlayer = await User.findByUsername('tommypastrami');
				const user2 = await User.findByUsername('bella');
				const createdBy = currentPlayer;
				const user = currentPlayer;
				const name = 'successful initialize prez game';
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
				const politicalRank = await PoliticalRank.findByName('President');
				const player1 = {
					user,
					joinedAt: new Date(),
					seatPosition: 0,
					politicalRank,
					drinksDrunk: 0,
					drinksReceived: [],
					drinksSent: [],
				};
				const player2 = {
					user: user2,
					joinedAt: new Date(),
					seatPosition: 1,
					politicalRank,
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
					players: [player1, player2],
				};

				await Presidents.create(game);
			});

			it('game with 2 players means players should have been dealt 26 cards each', async function() {
				const doc = await Presidents.findOne({
					name: 'successful initialize prez game',
				});
				try {
					await doc.initialize();
					expect(doc.players[0].hand.length).toBe(26);
					expect(doc.players[1].hand.length).toBe(26);
				} catch (err) {
					console.log(err);
				}
			});

			it('game.currentPlayer should have 3 ♣', async function() {
				const doc = await Presidents.findOne({
					name: 'successful initialize prez game',
				});
				const { players } = doc;
				const currentPlayer = players.find(
					player => player.user.toString() === doc.currentPlayer.toString(),
				);
				expect(
					currentPlayer.hand.find(card => card.shortHand === '3Clubs'),
				).toBeTruthy();
			});
		});
	});
