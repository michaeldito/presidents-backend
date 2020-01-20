import logger from '../../../../config/logger';

/**
 * This method will add a user to a Presidents game.
 * It assigns a seatPosition to the player based on how many players
 * are in the game.
 *
 * Validations
 * @throws {Error} Missing argument, user is required.
 * @throws {Error} Cannot join game. It`s in progress.
 * @throws {Error} Cannot join game. It`s finished.
 * @throws {Error} Cannot join game. It is already full.
 * @throws {Error} User has already joined game.
 *
 * @param {Object} user Mongoose ObjectId of the user to add.
 * @returns {Promise} Save result.
 *
 */
export default async function(user) {
	logger('[Presidents@join()]');
	logger(`[Presidents@join()] user: ${user}`);

	if (!user) {
		logger(`[Presidents@join()] missing arg user is required`);
		return Promise.reject(new Error('Missing argument, user is required.'));
	}

	if (this.status.value === 'IN_PROGRESS') {
		logger(`[Presidents@join()] cannot join game in progress`);
		return Promise.reject(new Error('Cannot join game. It`s in progress.'));
	}

	if (this.status.value === 'FINALIZED') {
		logger(`[Presidents@join()] cannot join a finalized game`);
		return Promise.reject(new Error('Cannot join game. It`s finished.'));
	}

	if (this.players.length === this.config.maxPlayers) {
		logger(`[Presidents@join()] cannot join a full game`);
		return Promise.reject(new Error('Cannot join game. It is already full.'));
	}

	const hasUserJoined = this.players.find(player =>
		player.user._id.equals(user._id),
	);
	if (hasUserJoined) {
		logger(`[Presidents@join()] user already joined`);
		return Promise.reject(new Error('User has already joined game.'));
	}

	const seatPosition = this.players.length;
	const player = {
		user: user._id,
		seatPosition,
		drinksDrunk: 0,
		drinksReceived: [],
		drinksSent: [],
	};
	if (user.nextGameRank) {
		player.politicalRank = user.nextGameRank;
	}

	logger(`[Presidents@join()] adding player ${player}`);
	this.players.push(player);

	return this.save();
}
