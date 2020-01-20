import logger from '../../../../config/logger';

export default async function() {
	console.log('[Presidents@getNextPlayer()]');

	const currentPlayer = this.players.find(
		player => player.user._id.toString() === this.currentPlayer.toString(),
	);
	const currentSeatPosition = currentPlayer.seatPosition;
	console.log(
		`[Presidents@getNextPlayer()] current seat position: ${currentSeatPosition}`,
	);

	let nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
	console.log(
		`[Presidents@getNextPlayer()] nextSeatPosition: ${nextSeatPosition}`,
	);

	let searching = true;
	let nextPlayer;

	console.log(
		'[Presidents@getNextPlayer()] begininng to search for next player',
	);
	while (searching) {
		nextPlayer = this.players.find(
			player => player.seatPosition === nextSeatPosition,
		);

		if (nextPlayer.toObject().hasOwnProperty('nextGameRank')) {
			console.log(
				`[Presidents@getNextPlayer()] player ${nextPlayer.user} - ${nextPlayer.seatPosition} is not next bc they are out`,
			);
			nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
			console.log(
				`[Presidents@getNextPlayer()] nextSeatPosition ${nextSeatPosition}`,
			);
		} else {
			console.log(
				`[Presidents@getNextPlayer()] user ${nextPlayer.user} is next`,
			);
			searching = false;
		}
	}

	return nextPlayer.user._id;
}
