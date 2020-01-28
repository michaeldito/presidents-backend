import logger from '../../../../config/logger';

export default async function() {
	logger('[Presidents@getNextPlayer()]');
	logger(this);
	const currentPlayer = this.players.find(
		player => player.user._id.equals(this.currentPlayer),
	);
	const currentSeatPosition = currentPlayer.seatPosition;
	logger(
		`[Presidents@getNextPlayer()] current seat position: ${currentSeatPosition}`,
	);

	let nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
	logger(
		`[Presidents@getNextPlayer()] nextSeatPosition: ${nextSeatPosition}`,
	);

	let searching = true;
	let nextPlayer;

	logger(
		'[Presidents@getNextPlayer()] begininng to search for next player',
	);
	while (searching) {
		nextPlayer = this.players.find(
			player => player.seatPosition === nextSeatPosition,
		);

		if (nextPlayer.toObject().hasOwnProperty('nextGameRank')) {
			logger(
				`[Presidents@getNextPlayer()] player ${nextPlayer.user} - ${nextPlayer.seatPosition} is not next bc they are out`,
			);
			nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
			logger(
				`[Presidents@getNextPlayer()] nextSeatPosition ${nextSeatPosition}`,
			);
		} else {
			logger(
				`[Presidents@getNextPlayer()] user ${nextPlayer.user} is next`,
			);
			searching = false;
		}
	}

	return nextPlayer.user._id;
}
