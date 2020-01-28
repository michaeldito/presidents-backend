import expect from 'expect';
import mongoose from 'mongoose';

import db from '../../../config/db';
import {
	drop as dropCards,
	init as initCards,
} from '../../../modules/Card/model/test';
import {
	drop as dropCardRanks,
	init as initCardRanks,
} from '../../../modules/CardRank/model/test';
import {
	drop as dropGameConfigurations,
	init as initGameConfigurations,
} from '../../../modules/GameConfiguration/model/test';
import {
	drop as dropGameStatuses,
	init as initGameStatuses,
} from '../../../modules/GameStatus/model/test';
import {
	drop as dropPoliticalRanks,
	init as initPoliticalRanks,
} from '../../../modules/PoliticalRank/model/test';
import {
	drop as dropSuits,
	init as initSuits,
} from '../../../modules/Suit/model/test';
// inits
import {
	drop as dropUsers,
	init as initUsers,
} from '../../../modules/User/model/test';
// models
import Card from '../../Card/model';
import GameConfiguration from '../../GameConfiguration/model';
import GameStatus from '../../GameStatus/model';
import PoliticalRank from '../../PoliticalRank/model';
import User from '../../User/model';
import Presidents from '.';
// conditionals
import areCardsBetterTest from './conditionals/areCardsBetter.test';
import areCardsValidTest from './conditionals/areCardsValid.test';
import didCurrentPlayersLastTurnEndTheRoundTest from './conditionals/didCurrentPlayersLastTurnEndTheRound.test';
import shouldProcessTurnTest from './conditionals/shouldProcessTurn.test';
// queries
import getNextPlayerTest from './queries/getNextPlayer.test';
import drinkDrinkTest from './updates/drinkDrink.test';
import giveDrinkTest from './updates/giveDrink.test';
// updates
import initializeTest from './updates/initialize.test';
import initializeNextRoundTest from './updates/initializeNextRound.test';
import joinTest from './updates/join.test';
import processTurnTest from './updates/processTurn.test';
// utils
import calculateSkipsTest from './utils/calculateSkips.test';

export const init = async () => {
	const count = await Presidents.countDocuments({});
	if (count === 1) return Promise.resolve();

	const status = await GameStatus.findByValue('NOT_STARTED');
	const config = await GameConfiguration.findOne({ name: 'Presidents' });
	const currentPlayer = await User.findByUsername('tommypastrami');
	const createdBy = currentPlayer;
	const cardsPlayed = await Card.find({ shortHand: '3Clubs' });
	const hand = await Card.find({}).limit(5);
	const user = currentPlayer;
	const name = 'test prez game';
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
			{
				user,
				joinedAt: new Date(),
				seatPosition: 1,
				hand,
				politicalRank,
				nextGameRank,
				drinksDrunk,
				drinksReceived,
				drinksSent,
			},
		],
	};

	await Presidents.create(game);
};

export const drop = async () => {
	await Presidents.deleteMany({});
};

export const test = async () =>
	describe('Presidents', function() {
		before(async function() {
			this.timeout(20000);
			await db.connect();
			await Promise.all([initCardRanks(), initSuits()]);
			await Promise.all([
				initCards(),
				initUsers(),
				initGameStatuses(),
				initPoliticalRanks(),
			]);
			await initGameConfigurations();
		});

		after(async function() {
			await Promise.all([
				dropCardRanks(),
				dropSuits(),
				dropCards(),
				dropUsers(),
				dropGameStatuses(),
				dropGameConfigurations(),
				dropPoliticalRanks(),
			]);
			await db.close();
		});

		describe('#init()', function() {
			it('verify it creates 1 presidents game document', async function() {
				await init();
				const docs = await Presidents.find({});
				// docs[0].config.deck=[]
				// console.log(JSON.stringify(docs[0], null, 2))
				expect(docs.length).toBe(1);
			});

			describe('validations', function() {
				before(async function() {
					// presidents game with all required feilds
					this.game = {
						rules: {
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
						},
						createdBy: mongoose.Types.ObjectId(),
						name: 'validation game',
						status: mongoose.Types.ObjectId(),
						config: mongoose.Types.ObjectId(),
						currentPlayer: mongoose.Types.ObjectId(),
						rounds: [
							{
								turns: [
									{
										user: mongoose.Types.ObjectId(),
										wasPassed: false,
										wasSkipped: false,
										didCauseSkips: false,
										skipsRemaining: 0,
										endedRound: false,
									},
								],
							},
						],
						players: [
							{
								user: mongoose.Types.ObjectId(),
								seatPosition: 1,
								drinksReceived: [{ sentBy: mongoose.Types.ObjectId() }],
								drinksSent: [{ sentTo: mongoose.Types.ObjectId() }],
							},
						],
					};

					this.rulesCopy = {
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
				});

				describe('rules', function() {
					it('rules are required', async function() {
						const { rules, ...rest } = this.game;
						const g1 = { ...rest };
						const instance = new Presidents(g1);
						const message =
							'A value for rules is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors.rules.message).toBe(message);
					});

					it('rules.doubleSkips is required', async function() {
						delete this.game.rules.doubleSkips;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.doubleSkips is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.doubleSkips'].message).toBe(message);
					});

					it('rules.scumStarts is required', async function() {
						delete this.game.rules.scumStarts;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.scumStarts is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.scumStarts'].message).toBe(message);
					});

					it('rules.scumHandsTwo is required', async function() {
						delete this.game.rules.scumHandsTwo;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.scumHandsTwo is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.scumHandsTwo'].message).toBe(message);
					});

					it('rules.oneEyedJacksAndKingOfHearts is required', async function() {
						delete this.game.rules.oneEyedJacksAndKingOfHearts;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.oneEyedJacksAndKingOfHearts is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(
							error.errors['rules.oneEyedJacksAndKingOfHearts'].message,
						).toBe(message);
					});

					it('rules.reversePresidentScumTrade is required', async function() {
						delete this.game.rules.reversePresidentScumTrade;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.reversePresidentScumTrade is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(
							error.errors['rules.reversePresidentScumTrade'].message,
						).toBe(message);
					});

					it('rules.presidentDeals is required', async function() {
						delete this.game.rules.presidentDeals;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.presidentDeals is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.presidentDeals'].message).toBe(message);
					});

					it('rules.goLow is required', async function() {
						delete this.game.rules.goLow;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.goLow is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.goLow'].message).toBe(message);
					});

					it('rules.equalNumber is required', async function() {
						delete this.game.rules.equalNumber;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.equalNumber is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.equalNumber'].message).toBe(message);
					});

					it('rules.noEndOnBomb is required', async function() {
						delete this.game.rules.noEndOnBomb;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.noEndOnBomb is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.noEndOnBomb'].message).toBe(message);
					});

					it('rules.tripleSixes is required', async function() {
						delete this.game.rules.tripleSixes;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.tripleSixes is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.tripleSixes'].message).toBe(message);
					});

					it('rules.passOut is required', async function() {
						delete this.game.rules.passOut;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.passOut is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.passOut'].message).toBe(message);
					});

					it('rules.fourInARow is required', async function() {
						delete this.game.rules.fourInARow;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.fourInARow is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.fourInARow'].message).toBe(message);
					});

					it('rules.larryPresidents is required', async function() {
						delete this.game.rules.larryPresidents;
						const instance = new Presidents(this.game);
						const message =
							'A value for rules.larryPresidents is required to create a Presidents game.';
						const error = instance.validateSync();

						expect(error.errors['rules.larryPresidents'].message).toBe(message);
					});
				});

				describe('rounds', function() {
					describe('turns', function() {
						it('turns.user is required', async function() {
							const turn = {
								wasPassed: false,
								wasSkipped: false,
								didCauseSkips: false,
								skipsRemaining: 0,
								endedRound: false,
							};
							const doc = await Presidents.findOne({});
							doc.rounds[0].turns.push(turn);
							doc.save(error => {
								const message =
									'A value for rounds[i].turns[i].user is required.';
								expect(error.errors['rounds.0.turns.1.user'].message).toBe(
									message,
								);
							});
						});

						it('turns.wasPassed is required', async function() {
							const turn = {
								user: mongoose.Types.ObjectId(),
								wasSkipped: false,
								didCauseSkips: false,
								skipsRemaining: 0,
								endedRound: false,
							};
							const doc = await Presidents.findOne({});
							doc.rounds[0].turns.push(turn);
							doc.save(error => {
								const message =
									'A value for rounds[i].turns[i].wasPassed is required.';
								expect(error.errors['rounds.0.turns.1.wasPassed'].message).toBe(
									message,
								);
							});
						});

						it('turns.wasSkipped is required', async function() {
							const turn = {
								user: mongoose.Types.ObjectId(),
								wasPassed: false,
								didCauseSkips: false,
								skipsRemaining: 0,
								endedRound: false,
							};
							const doc = await Presidents.findOne({});
							doc.rounds[0].turns.push(turn);
							doc.save(error => {
								const message =
									'A value for rounds[i].turns[i].wasSkipped is required.';
								expect(
									error.errors['rounds.0.turns.1.wasSkipped'].message,
								).toBe(message);
							});
						});

						it('turns.didCauseSkips is required', async function() {
							const turn = {
								user: mongoose.Types.ObjectId(),
								wasPassed: false,
								wasSkipped: false,
								skipsRemaining: 0,
								endedRound: false,
							};
							const doc = await Presidents.findOne({});
							doc.rounds[0].turns.push(turn);
							doc.save(error => {
								const message =
									'A value for rounds[i].turns[i].didCauseSkips is required.';
								expect(
									error.errors['rounds.0.turns.1.didCauseSkips'].message,
								).toBe(message);
							});
						});

						it('turns.skipsRemaining is required', async function() {
							const turn = {
								user: mongoose.Types.ObjectId(),
								wasPassed: false,
								wasSkipped: false,
								didCauseSkips: false,
								endedRound: false,
							};
							const doc = await Presidents.findOne({});
							doc.rounds[0].turns.push(turn);
							doc.save(error => {
								const message =
									'A value for rounds[i].turns[i].skipsRemaining is required.';
								expect(
									error.errors['rounds.0.turns.1.skipsRemaining'].message,
								).toBe(message);
							});
						});

						it('turns.endedRound is required', async function() {
							const turn = {
								user: mongoose.Types.ObjectId(),
								wasPassed: false,
								wasSkipped: false,
								didCauseSkips: false,
								skipsRemaining: 0,
							};
							const doc = await Presidents.findOne({});
							doc.rounds[0].turns.push(turn);
							doc.save(error => {
								const message =
									'A value for rounds[i].turns[i].endedRound is required.';
								expect(
									error.errors['rounds.0.turns.1.endedRound'].message,
								).toBe(message);
							});
						});
					});
				});

				describe('players', function() {
					it('players.user is required', async function() {
						const player = {
							seatPosition: 0,
						};
						const doc = await Presidents.findOne({});
						doc.players.push(player);
						doc.save(error => {
							const message = 'A value for players[i].user is required.';
							expect(error.errors['players.1.user'].message).toBe(message);
						});
					});

					it('players.seatPosition is required', async function() {
						const player = {
							user: mongoose.Types.ObjectId(),
						};
						const doc = await Presidents.findOne({});
						doc.players.push(player);
						doc.save(error => {
							const message = 'A value for players[i].seatPosition is required.';
							expect(error.errors['players.1.seatPosition'].message).toBe(
								message,
							);
						});
					});

					it('drinksReceived.sentBy is required', async function() {
						const doc = await Presidents.findOne({});
						doc.players[0].drinksReceived.push({});
						doc.save(error => {
							const message =
								'A value for players[i].drinksReceived.sentBy is required.';
							expect(
								error.errors['players.0.drinksReceived.1.sentBy'].message,
							).toBe(message);
						});
					});

					it('drinksSent.sentTo is required', async function() {
						const doc = await Presidents.findOne({});
						doc.players[0].drinksSent.push({});
						doc.save(error => {
							const message =
								'A value for players[i].drinksSent.sentTo is required.';
							expect(
								error.errors['players.0.drinksSent.1.sentTo'].message,
							).toBe(message);
						});
					});
				});
			});
		});

		joinTest();

		initializeTest();

		initializeNextRoundTest();

		getNextPlayerTest();

		areCardsBetterTest();

		areCardsValidTest();

		shouldProcessTurnTest();

		calculateSkipsTest();

		processTurnTest();

		didCurrentPlayersLastTurnEndTheRoundTest();

		drinkDrinkTest();

		giveDrinkTest();

		describe('#drop()', function() {
			it('verify drop() deletes all presidents game documents', async function() {
				await drop();
				const docs = await Presidents.find({});
				expect(docs.length).toBe(0);
			});
		});
	});

const Test = { init, drop, test };

export default Test;