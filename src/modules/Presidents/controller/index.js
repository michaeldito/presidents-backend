import { Types } from 'mongoose';

import Transaction from '../../../utils/Transaction';
import Card from '../../Card/model';
import GameConfiguration from '../../GameConfiguration/model';
import GameStatus from '../../GameStatus/model';
import User from '../../User/model';
import Presidents from '../model';

export const getAll = async ctx => {
	console.log(`[koa@GET('/presidents/getAll')]`);

	try {
		const docs = await Presidents.find({});
		console.log(`[koa@GET('/presidents/getAll')] found ${docs.length} docs`);
		const body = { total: docs.length, data: docs };

		ctx.body = body;
		ctx.status = 200;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	console.log(`[koa@GET('/presidents/getOne')]`);

	const { id } = ctx.params;

	try {
		const doc = await Presidents.findById(id);
		console.log(`[koa@GET('/presidents/getOne')] found: ${!!doc}`);
		const body = doc.toObject();

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const details = async ctx => {
	console.log(`[koa@GET('/presidents/details')]`);

	try {
		let docs = await Presidents.find({});
		docs = docs
			.map(doc => {
				let {
					id,
					name,
					createdAt,
					startedAt,
					finishedAt,
					status,
					createdBy,
					winner,
				} = doc.toJSON();
				const type = doc.config.name;
				if (!winner) {
					winner = '-';
				}
				return {
					id,
					name,
					type,
					createdAt,
					startedAt,
					finishedAt,
					status,
					createdBy,
					winner,
				};
			})
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		console.log(`[koa@GET('/presidents/details')] found ${docs.length} docs`);
		const body = docs;

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const create = async ctx => {
	console.log(`[koa@POST('/presidents/create')]`);
	console.log(ctx.request.body);
	const { name, createdBy, gameType } = ctx.request.body;
	console.log({ name, createdBy, gameType });

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

	try {
		let doc;

		await Transaction(async () => {
			console.log(`[koa@POST('/presidents')] finding config`);
			let config = await GameConfiguration.findByName(gameType);
			config = config._id;

			console.log(`[koa@POST('/presidents')] finding not started status`);
			let status = await GameStatus.findByValue('NOT_STARTED');
			status = status._id;

			console.log(`[koa@POST('/presidents')] finding user`);
			let user = await User.findById(createdBy);
			console.log(`user: ${user}`);
			user = user._id;
			const game = { name, status, createdBy: user, rules, config };

			console.log(`[koa@POST('/presidents')] creating the game`);
			console.log(`[koa@POST('/presidents')] ${game}`);
			doc = await Presidents.create(game);

			console.log(`[koa@POST('/presidents')] adding creator to the game`);
			doc = await doc.join(user);

			console.log(
				`[koa@POST('/presidents')] adding game to creators gamesPlayed`,
			);
			user = await User.findOne(user);
			user.gamesPlayed.push(doc._id);
			await user.save();
		});

		doc = await Presidents.findById(doc._id);
		const body = doc.toObject();

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const join = async ctx => {
	console.log(`[koa@PUT('/presidents/join')]`);

	const { id } = ctx.params;
	const { userId } = ctx.request.body;
	console.log(`[koa@PUT('/presidents/join')] user: ${userId}`);

	try {
		let doc;

		await Transaction(async () => {
			console.log(`[koa@POST('/presidents/join')] adding user to game`);
			let user = await User.findById(userId);
			console.log(`[koa@PUT('/presidents/join')] ${user}`);
			doc = await Presidents.findById(id);
			doc = await doc.join(user);

			console.log(
				`[koa@POST('/presidents/join')] adding game to creators gamesPlayed`,
			);
			user.gamesPlayed.push(doc._id);
			user = await user.save();
		});

		doc = await Presidents.findById(doc._id);
		const body = doc.toObject();

		ctx.request.app.io.emit('game join', {
			game: body,
		});

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const initialize = async ctx => {
	console.log(`[koa@PUT('/presidents/initialize')]`);

	const { id } = ctx.params;

	try {
		let doc;

		await Transaction(async () => {
			doc = await Presidents.findById(id);
			await doc.initialize();
			await doc.initializeNextRound();
		});

		doc = await Presidents.findById(doc._id);
		const body = doc.toObject();

		ctx.request.app.io.emit('game refresh', {
			game: body,
		});

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const processTurn = async ctx => {
	console.log(`[koa@PUT('/presidents/processTurn')]`);

	const { id } = ctx.params;
	let { user, cardsPlayed, wasPassed } = ctx.request.body;
	let turn;
	console.log(
		`[koa@PUT('/presidents/processTurn')] cardsPlayed: ${JSON.stringify(
			cardsPlayed,
		)}`,
	);

	try {
		let body;
		let doc;

		await Transaction(async () => {
			doc = await Presidents.findById(id);
			cardsPlayed = await Card.findManyByIds(cardsPlayed);

			const { turnToBeat } = doc;
			let turnToBeatCards = [];
			// we don't have tturn to beat when we start -> undefined
			// when the round is ended we clear turn to beat -> null
			// this verifies that we do have cards to lookup from the last turn to beat
			if (turnToBeat !== undefined && turnToBeat !== null) {
				turnToBeatCards = await Card.findManyByIds(turnToBeat.cardsPlayed);
			}
			if (doc.status.value !== 'IN_PROGRESS') {
				ctx.throw(400, 'cannot process turn - game is not in progress');
			}
			// user is passing
			if (wasPassed && user._id === doc.currentPlayer.toString()) {
				console.log(`[koa@PUT('presidents/processTurn')] turn was a pass`);
				if (cardsPlayed.length > 0) {
					ctx.throw(400, 'cannot pass and submit cards');
				}

				turn = {
					user: user._id,
					cardsPlayed,
					wasPassed,
					wasSkipped: false,
					didCauseSkips: false,
					skipsRemaining: 0,
					endedRound: false,
				};

				doc = await doc.processTurn(turn);
				body = doc.toObject();
			} else {
				// user is not passing
				console.log(`[koa@PUT('presidents/processTurn')] turn is not a pass`);
				turn = { user: user._id, cardsPlayed, wasPassed };

				console.log(
					`[koa@PUT('presidents/processTurn')] should we process this turn?`,
				);
				const shouldProcessTurn = await doc.shouldProcessTurn(turn);

				// is the turn valid and better, or a special card?
				if (shouldProcessTurn) {
					console.log(
						`[koa@PUT('presidents/processTurn')] we need to process this turn`,
					);
					console.log(
						`[koa@PUT('presidents/processTurn')] will it cause any skips?`,
					);
					turn.skipsRemaining = Presidents.calculateSkips(
						turnToBeatCards,
						cardsPlayed,
					);
					turn.didCauseSkips = turn.skipsRemaining > 0;
					turn.wasSkipped = false;
					turn.endedRound = false;

					doc = await doc.processTurn(turn);

					// process any skips
					if (turn.didCauseSkips) {
						console.log(
							`[koa@PUT('presidents/processTurn')] we also need to process ${turn.skipsRemaining} skips`,
						);
						while (turn.skipsRemaining) {
							turn.skipsRemaining--;
							const skipTurn = {
								user: doc.currentPlayer,
								cardsPlayed: [],
								wasPassed: false,
								wasSkipped: true,
								didCauseSkips: false,
								skipsRemaining: turn.skipsRemaining,
								endedRound: false,
							};
							console.log(
								`[koa@PUT('presidents/processTurn')] time to process a skip`,
							);
							doc = await doc.processTurn(skipTurn);
						}
					}
				}
			}

			if (doc.status.value === 'IN_PROGRESS') {
				console.log(
					`[koa@PUT('presidents/processTurn')] did the next player's last turn end the round?`,
				);
				const didCurrentPlayersLastTurnEndTheRound = doc.didCurrentPlayersLastTurnEndTheRound();
				console.log(
					`[koa@PUT('presidents/processTurn')] didCurrentPlayersLastTurnEndTheRound ${didCurrentPlayersLastTurnEndTheRound}`,
				);

				if (didCurrentPlayersLastTurnEndTheRound) {
					console.log(
						`[koa@PUT('presidents/processTurn')] let's initialize the next round & reset the hand to beat`,
					);
					doc = await doc.initializeNextRound();
				}
			}
		});

		doc = await Presidents.findById(doc._id);
		body = doc.toObject();

		ctx.request.app.io.emit('game refresh', {
			game: body,
		});

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const giveDrink = async ctx => {
	console.log(`[koa@PUT('/presidents/giveDrink')]`);

	const { id } = ctx.params;
	let { toUser, fromUser } = ctx.request.body;

	try {
		let doc;

		await Transaction(async () => {
			doc = await Presidents.findById(id);
			fromUser = await User.findById(fromUser);
			toUser = await User.findById(toUser);
			doc = await doc.giveDrink(fromUser, toUser);
		});

		doc = await Presidents.findById(doc._id);

		const body = doc.toObject();

		ctx.request.app.io.emit('drink given', {
			game: body,
		});

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const drinkDrink = async ctx => {
	console.log(`[koa@PUT('/presidents/drinkDrink')]`);

	const { id } = ctx.params;
	const { userId } = ctx.request.body;

	try {
		let doc;

		await Transaction(async () => {
			doc = await Presidents.findById(id);
			const user = await User.findById(userId);

			doc = await doc.drinkDrink(user);
			doc = await Presidents.findById(doc._id);
		});

		const body = doc.toObject();

		ctx.request.app.io.emit('drink drunk', {
			game: body,
		});

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const rematch = async ctx => {
	console.log(`[koa@POST('/presidents/rematch')]`);

	const { id } = ctx.params;

	try {

		let doc;
		
		await Transaction(async () => {
			doc = await Presidents.findById(id);

			console.log(
				`[koa@POST('/presidents/rematch')] sorting players by seat position`,
			);
			const players = doc.players.sort((a, b) =>
				a.seatPosition < b.seatPosition ? 1 : -1,
			);

			const usersToAdd = [];
			console.log(
				`[koa@POST('/presidents/rematch')] grabbing their userId and nextGameRanks`,
			);
			for (const player of players) {
				const { user, nextGameRank } = player;
				usersToAdd.push({ _id: user._id, nextGameRank });
			}

			const { rules, createdBy, config } = doc;
			const name = `${doc.name}-rematch-${Types.ObjectId()}`;
			const status = await GameStatus.findByValue('NOT_STARTED');

			console.log(
				`[koa@POST('/presidents/rematch')] creating a rematch game with same configs`,
			);
			doc = await Presidents.create({ name, status, rules, createdBy, config });

			for (const user of usersToAdd) {
				console.log(`[koa@POST('/presidents/rematch')] adding user ${user._id}`);
				doc = await doc.join(user);
				const userDoc = await User.findById(user._id);
				userDoc.gamesPlayed.push(doc._id);
				await userDoc.save();
			}

			console.log(`[koa@POST('/presidents/rematch')] initializing the game`);
			doc = await doc.initialize();
			doc = await doc.initializeNextRound();
		});

		doc = await Presidents.findById(doc._id);
		const body = doc.toObject();

		ctx.request.app.io.emit('rematch started', {
			game: body,
		});

		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

const Controller = {
	getAll,
	getOne,
	details,
	create,
	initialize,
	processTurn,
	giveDrink,
	drinkDrink,
	rematch
};

export default Controller;