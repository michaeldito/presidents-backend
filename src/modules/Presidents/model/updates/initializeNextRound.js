import GameStatus from '../../../GameStatus/model';
import logger from '../../../../config/logger';

/**
 * This method will initialize the next round of Presidents.
 * If the game hasn't started yet, it updates the status.
 * It adds a new round to the game.
 * 
 * # Validations
 * @throws {Error} Unable to start next round. The game is finalized.

 * @returns {Promise} Save result.
 * 
 */
export default async function() {
	logger('[Presidents@initializeNextRound()]');

	if (this.status.value === 'FINALIZED') {
		logger(
			'[Presidents@initializeNextRound()] unable to init next round bc game is FINALIZED',
		);
		return Promise.reject(
			new Error('Unable to start next round. The game is finalized.'),
		);
	}
	if (this.status.value === 'IN_PROGRESS') {
		logger(
			'[Presidents@initializeNextRound()] game in progress - adding a round',
		);
		this.rounds.push({ turns: [] });
		if (this.turnToBeat) {
			this.turnToBeat.remove();
		}
	}
	if (this.status.value === 'NOT_STARTED') {
		logger(
			`[Presidents@initializeNextRound()] this is the first round of the game`,
		);
		logger(
			`[Presidents@initializeNextRound()] setting startedAt and updating status to IN_PROGRESS`,
		);
		this.startedAt = new Date();
		this.status = await GameStatus.findOne({ value: 'IN_PROGRESS' });
		logger('[Presidents@initializeNextRound()] adding a round');
		this.rounds.push({ turns: [] });
	}

	return this.save();
}
