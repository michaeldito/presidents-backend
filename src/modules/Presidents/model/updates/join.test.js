import expect from 'expect';
import mongoose from 'mongoose';

import Card from '../../../Card/model';
import GameConfiguration from '../../../GameConfiguration/model';
import GameStatus from '../../../GameStatus/model';
import PoliticalRank from '../../../PoliticalRank/model';
import User from '../../../User/model';
import Presidents from '../../model';

export default async () =>
	describe('#join()', function() {
		before(async function() {
			const status = await GameStatus.findByValue('IN_PROGRESS');
			const config = await GameConfiguration.findOne({ name: 'Presidents' });
			const currentPlayer = await User.findByUsername('tommypastrami');
			const createdBy = currentPlayer;
			const cardsPlayed = await Card.find({ shortHand: '3Clubs' });
			const hand = await Card.find({}).limit(5);
			const user = currentPlayer;
			const name = 'validation prez game';
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
				players: [
					player,
					player,
					player,
					player,
					player,
					player,
					player,
					player,
				],
			};

			await Presidents.create(game);
		});

		describe('validations', function() {
			it('game is in progress', async function() {
				const doc = await Presidents.findOne({ name: 'validation prez game' });
				const message = 'Cannot join game. It`s in progress.';
				const user = mongoose.Types.ObjectId();

				try {
					await doc.join(user);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('game is finished', async function() {
				let doc = await Presidents.findOne({ name: 'validation prez game' });
				doc.status = await GameStatus.findByValue('FINALIZED');
				await doc.save();

				doc = await Presidents.findOne({ name: 'validation prez game' });
				const message = 'Cannot join game. It`s finished.';
				const user = mongoose.Types.ObjectId();

				try {
					await doc.join(user);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('game is full', async function() {
				let doc = await Presidents.findOne({ name: 'validation prez game' });
				doc.status = await GameStatus.findByValue('NOT_STARTED');
				await doc.save();

				doc = await Presidents.findOne({ name: 'validation prez game' });
				const message = 'Cannot join game. It is already full.';
				const user = mongoose.Types.ObjectId();

				try {
					await doc.join(user);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('user has already joined', async function() {
				await Presidents.updateOne(
					{ name: 'validation prez game' },
					{ $pop: { players: 1 } },
				);
				const message = 'User has already joined game.';

				try {
					const doc = await Presidents.findOne({ name: 'validation prez game' });
					const user = await User.findByUsername('tommypastrami');
					await doc.join(user);
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});

			it('user is required', async function() {
				const doc = await Presidents.findOne({ name: 'validation prez game' });
				const message = 'Missing argument, user is required.';

				try {
					await doc.join();
				} catch (err) {
					expect(err.message).toBe(message);
				}
			});
		});

		describe('successful', function() {
			it('user is added to the game', async function() {
				let doc = await Presidents.findOne({ name: 'validation prez game' });
				const user = mongoose.Types.ObjectId();
				try {
					await doc.join(user);
					doc = await Presidents.findOne({ name: 'validation prez game' });
					expect(doc.players.length).toBe(8);
				} catch (err) {}
			});

			it('player[user].joinedAt has a timestamp', async function() {
				const doc = await Presidents.findOne({ name: 'validation prez game' });
				try {
					expect(doc.players[7].joinedAt).toBeTruthy();
				} catch (err) {}
			});

			it('player[user].seatPosition is set incrementally', async function() {});
		});
	});
