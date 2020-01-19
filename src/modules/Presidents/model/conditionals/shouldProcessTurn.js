import utils from '../../../../utils';
import Card from '../../../Card/model';

export default async function(turn) {
	console.log('[Presidents@shouldProcessTurn()]');
	console.log(
		`[Presidents@shouldProcessTurn()] currentPlayer: ${this.currentPlayer}`,
	);
	console.log(
		`[Presidents@shouldProcessTurn()] turnToBeat: ${JSON.stringify(
			this.turnToBeat,
		)}`,
	);
	console.log(`[Presidents@shouldProcessTurn()] turn: ${JSON.stringify(turn)}`);

	// 1 - is it this players turn?
	const isPlayersTurn = turn.user === this.currentPlayer.toString();
	console.log(
		`[Presidents@shouldProcessTurn()] isPlayersTurn: ${isPlayersTurn}`,
	);
	if (!isPlayersTurn)
		return Promise.reject(
			new Error(`Unable to process turn. It is not your turn.`),
		);

	// 2 - is the current hand valid (all ranks the same)?
	const areCardsValid = utils.areCardsValid(turn.cardsPlayed);
	console.log(
		`[Presidents@shouldProcessTurn()] areCardsValid: ${areCardsValid}`,
	);
	if (!areCardsValid)
		return Promise.reject(
			new Error(`Unable to process turn. The cards selected are invalid.`),
		);

	// first turn of the game must contain 3 clubs
	if (this.rounds.length === 1 && this.rounds[0].turns.length === 0) {
		const contains3Clubs = turn.cardsPlayed.find(
			card => card.shortHand === '3Clubs',
		);
		if (contains3Clubs) {
			console.log(
				'[Presidents@shouldProcessTurn()] found 3 clubs on first hand of game',
			);
			return Promise.resolve(true);
		}
		console.log(
			'[Presidents@shouldProcessTurn()] first turn of game is not 3 clubs',
		);
		return Promise.reject(
			new Error('First turn of the game must be a 3 of clubs'),
		);
	}

	// first turn of every other round can be anything
	if (this.rounds[this.rounds.length - 1].length === 0) {
		console.log(
			'[Presidents@shouldProcessTurn()] first turn of any round can be whatever',
		);
		return Promise.resolve(true);
	}

	// it's a turn in the middle of the round, see if it's better than the lastx
	let areCardsBetter;
	try {
		if (this.turnToBeat === undefined || this.turnToBeat === null) {
			return Promise.resolve(true);
		}
		console.log(
			`[Presidents@shouldProcessTurn()] cardsPlayed: ${JSON.stringify(
				this.turnToBeat.cardsPlayed,
			)}`,
		);
		const cardsToBeat = await Card.find({
			_id: { $in: this.turnToBeat.cardsPlayed },
		});
		areCardsBetter = await utils.areCardsBetter(cardsToBeat, turn.cardsPlayed);
		console.log(
			`[Presidents@shouldProcessTurn()] areCardsBetter: ${areCardsBetter}`,
		);
	} catch (err) {
		return Promise.reject(
			new Error(
				`Unable to process turn. The selected cards are not better. ${err.message}`,
			),
		);
	}

	console.log(
		`[Presidents@shouldProcessTurn()] shouldProcessTurn: ${areCardsBetter}`,
	);
	if (areCardsBetter) {
		return Promise.resolve(true);
	}

	return Promise.reject(new Error('Unable to process turn. Not sure why.'));
}
