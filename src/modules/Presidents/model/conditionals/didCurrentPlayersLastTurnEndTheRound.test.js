import expect from 'expect';

import Card from '../../../Card/model';
import GameConfiguration from '../../../GameConfiguration/model';
import GameStatus from '../../../GameStatus/model';
import PoliticalRank from '../../../PoliticalRank/model';
import User from '../../../User/model';
import Presidents from '../../model';

export default async () =>
	describe('#didCurrentPlayersLastTurnEndTheRound()', function() {
		before(async function() {
			const status = await GameStatus.findByValue('IN_PROGRESS');
			const config = await GameConfiguration.findOne({ name: 'Presidents' });

			this.user1 = await User.findByUsername('tommypastrami');
			this.user2 = await User.findByUsername('bella');
			this.user3 = await User.findByUsername('tony');

			const user1 = this.user1._id;
			const user2 = this.user2._id;
			const user3 = this.user3._id;

			const currentPlayer = user2;
			const createdBy = currentPlayer;
			const name = 'did current players last turn end the round prez game';

			const jackHearts = await Card.findOne({ shortHand: 'JHearts' });
			const aceSpades = await Card.findOne({ shortHand: 'ASpades' });
			const aceHearts = await Card.findOne({ shortHand: 'AHearts' });
			const jackDiamonds = await Card.findOne({ shortHand: 'JDiamonds' });
			const jackClubs = await Card.findOne({ shortHand: 'JClubs' });
			const threeClubs = await Card.findOne({ shortHand: '3Clubs' });
			const fourClubs = await Card.findOne({ shortHand: '4Clubs' });
			const fourDiamonds = await Card.findOne({ shortHand: '4Diamonds' });

			this.jackHearts = jackHearts;
			this.jackDiamonds = jackDiamonds;
			this.jackClubs = jackClubs;
			this.aceSpades = aceSpades;
			this.threeClubs = threeClubs;
			this.fourClubs = fourClubs;
			this.fourDiamonds = fourDiamonds;
			this.aceHearts = aceHearts;

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
				hand: [threeClubs, fourClubs],
				drinksDrunk: 0,
				drinksReceived: [],
				drinksSent: [],
			};

			const player2 = {
				user: user2,
				joinedAt: new Date(),
				seatPosition: 1,
				hand: [fourDiamonds, jackDiamonds, jackClubs],
				drinksDrunk: 0,
				drinksReceived: [],
				drinksSent: [],
			};

			const player3 = {
				user: user3,
				joinedAt: new Date(),
				seatPosition: 2,
				hand: [aceSpades, aceHearts],
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
				currentPlayer,
				handToBeat: [jackHearts],
				rounds: [
					{
						turns: [
							{
								user: this.user2,
								cardsPlayed: [jackHearts],
								wasPassed: false,
								wasSkipped: false,
								didCauseSkips: true,
								skipsRemaining: 0,
								endedRound: false,
							},
							{
								user: this.user3,
								cardsPlayed: [],
								wasPassed: false,
								wasSkipped: true,
								didCauseSkips: false,
								skipsRemaining: 0,
								endedRound: false,
							},
							{
								user: this.user1,
								cardsPlayed: [],
								wasPassed: true,
								wasSkipped: false,
								didCauseSkips: false,
								skipsRemaining: 0,
								endedRound: false,
							},
						],
					},
				],
				players: [player1, player2, player3],
			};

			await Presidents.create(game);
		});

		it('true', async function() {
			// it's user2 turn
			const doc = await Presidents.findOne({
				name: 'did current players last turn end the round prez game',
			});
			const didPlayRoundEndingTurn = doc.didCurrentPlayersLastTurnEndTheRound();
			expect(didPlayRoundEndingTurn).toBe(true);
		});

		it('false - they skipped', async function() {
			// it's user2 turn
			const doc = await Presidents.findOne({
				name: 'did current players last turn end the round prez game',
			});
			const turn = {
				user: doc.currentPlayer,
				cardsPlayed: [],
				wasPassed: true,
				wasSkipped: false,
				didCauseSkips: false,
				skipsRemaining: 0,
				endedRound: false,
			};
			await doc.processTurn(turn);

			// it's now user3 turn
			const didPlayRoundEndingTurn = doc.didCurrentPlayersLastTurnEndTheRound();
			expect(didPlayRoundEndingTurn).toBe(false);
		});

		it('false - they passed', async function() {
			// it's now user3 turn
			const doc = await Presidents.findOne({
				name: 'did current players last turn end the round prez game',
			});
			const turn = {
				user: doc.currentPlayer,
				cardsPlayed: [],
				wasPassed: true,
				wasSkipped: false,
				didCauseSkips: false,
				skipsRemaining: 0,
				endedRound: false,
			};
			await doc.processTurn(turn);

			// it's user1 turn
			const didPlayRoundEndingTurn = doc.didCurrentPlayersLastTurnEndTheRound();
			expect(didPlayRoundEndingTurn).toBe(false);
		});

		it('false - someone played a better hand', async function() {
			// it's user1 turn
			const doc = await Presidents.findOne({
				name: 'did current players last turn end the round prez game',
			});
			let turn = {
				user: doc.currentPlayer,
				cardsPlayed: [this.fourClubs],
				wasPassed: false,
				wasSkipped: false,
				didCauseSkips: false,
				skipsRemaining: 0,
				endedRound: false,
			};
			await doc.processTurn(turn);

			// it's user2 turn
			turn = {
				user: doc.currentPlayer,
				cardsPlayed: [this.fourDiamonds],
				wasPassed: false,
				wasSkipped: false,
				didCauseSkips: false,
				skipsRemaining: 0,
				endedRound: false,
			};
			await doc.processTurn(turn);

			// it's user3 turn
			turn = {
				user: doc.currentPlayer,
				cardsPlayed: [],
				wasPassed: true,
				wasSkipped: false,
				didCauseSkips: false,
				skipsRemaining: 0,
				endedRound: false,
			};
			await doc.processTurn(turn);

			// it's user1 turn
			const didPlayRoundEndingTurn = doc.didCurrentPlayersLastTurnEndTheRound();
			expect(didPlayRoundEndingTurn).toBe(false);
		});
	});
