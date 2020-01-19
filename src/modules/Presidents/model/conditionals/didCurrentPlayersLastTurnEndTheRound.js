import Utils from '../../../../utils';

/**
 * Algorithm:
 *  1. Get the latest round.
 *  2. Slice the array so that it contains the current player's last turn and every
 *     turn after it.
 *  2a. Do so by searching through the array starting from the end to find the index
 *      of the current player's last turn.
 *  2b. If a turn is not found then return false because they haven't played in the current
 *      round yet.
 *  3. If the turn was found and we have sliced the array, check if the turn was a pass or
 *     a skip. If so return false because they couldn't have ended the round with that.
 *  4. Check the turns immediately after the current player's last turn for a skip.
 *  5. Once all skips have been iterated over begin checking for passes. If any player didn't
 *     pass then they must have played a turn better than the current player, so return false.
 *  6. If we finish iterating over the rest of the turns then nobody played a better hand,
 *     and therefore the current player's turn ended the round, so return true.
 */
export default function() {
	console.log('[Presidents@didCurrentPlayersLastTurnEndTheRound()]');
	const latestRound = this.rounds[this.rounds.length - 1];
	console.log(`latestRound ${latestRound}`);
	let playersLastTurnIdx;
	let searchingForLastTurn = true;
	let foundLastTurn = false;
	let i = latestRound.turns.length;
	console.log(`i ${i}`);

	if (i < this.players.length) {
		console.log(
			`[Presidents@didCurrentPlayersLastTurnEndTheRound()] not all players have played a turn yet so no`,
		);
		return false;
	}

	while (searchingForLastTurn) {
		i--;
		const turn = latestRound.turns[i];
		if (this.currentPlayer.equals(turn.user)) {
			playersLastTurnIdx = i;
			searchingForLastTurn = false;
			foundLastTurn = true;
		}
	}
	console.log(
		`[Presidents@didCurrentPlayersLastTurnEndTheRound()] playersLastTurnIdx: ${playersLastTurnIdx}`,
	);

	// TODO:
	// if it was a two then yes it did, regardless of if all players have played

	if (!foundLastTurn) {
		console.log(
			`[Presidents@didCurrentPlayersLastTurnEndTheRound()] foundLastTurn: ${foundLastTurn}`,
		);
		return false;
	}

	const turns = latestRound.turns.slice(playersLastTurnIdx);
	const playersLastTurn = turns[0];
	if (playersLastTurn.wasSkipped) {
		console.log(
			`[Presidents@didCurrentPlayersLastTurnEndTheRound()] did they skip themself and it's still there turn?`,
		);
		const searchingForWhoCausedSkip = true;
		while (searchingForWhoCausedSkip) {
			i--;
			const turn = latestRound.turns[i];
			if (turn.didCauseSkips) {
				if (this.currentPlayer.equals(turn.user)) {
					console.log(`[Presidents@didCurrentPlayersLastTurnEndTheRound()] yes`);
					return true;
				}
				console.log(`[Presidents@didCurrentPlayersLastTurnEndTheRound()] no`);
				return false;
			}
		}

		return false;
	}
	if (playersLastTurn.wasPassed) {
		console.log(
			`[Presidents@didCurrentPlayersLastTurnEndTheRound()] wasPassed ${playersLastTurn.wasPassed}`,
		);
		return false;
	}

	i = 1;
	let checkingForSkips = true;
	console.log(
		`[Presidents@didCurrentPlayersLastTurnEndTheRound()] checkingForSkips`,
	);

	while (checkingForSkips && i < turns.length) {
		const turn = turns[i];
		console.log(
			`[Presidents@didCurrentPlayersLastTurnEndTheRound()] turn: ${turn.user} ${turn.wasSkipped}`,
		);
		if (!turn.wasSkipped) {
			checkingForSkips = false;
		} else {
			console.log(
				`[Presidents@didCurrentPlayersLastTurnEndTheRound()] skip found by: ${turn.user}`,
			);
			i++;
		}
	}

	const checkingForPasses = true;
	console.log(
		`[Presidents@didCurrentPlayersLastTurnEndTheRound()] checkingForPasses`,
	);
	while (checkingForPasses && i < turns.length) {
		const turn = turns[i];
		if (!turn.wasPassed) {
			console.log(
				`[Presidents@didCurrentPlayersLastTurnEndTheRound()] user ${
					turn.user
				} played a better hand: ${turn.cardsPlayed.map(c => c.shortHand)}`,
			);
			return false;
		}
		console.log(
			`[Presidents@didCurrentPlayersLastTurnEndTheRound()] turn for user: ${turn.user} was passed`,
		);
		i++;
	}

	console.log(
		'[Presidents@didCurrentPlayersLastTurnEndTheRound()] yes it ended the round',
	);
	return true;
}
