import logger from '../config/logger';
import User from '../modules/User/model';

const GameMembership = async (ctx, next) => {
	const token = ctx.cookies.get('access_token');
	const { id } = ctx.params;
	const doc = await User.findByToken(token);

	if (!doc) {
		logger(`[GameMembership] DENIED - no user found for token`);
		ctx.body = `[GameMembership] DENIED - no user found for token`;
		return false;
	}
	const isMember = doc.gamesPlayed.find(game => game._id === id);
	if (isMember) {
		logger(`[GameMembership] DENIED - user is not a member of the game`);
		ctx.body = `[GameMembership] DENIED - user is not a member of the game`;
		return false;
	}

	logger(`[GameMembership] APPROVED - user is a member of the game`);
	ctx.body = `[GameMembership] APPROVED - user is a member of the game`;
	return next();
};

export default GameMembership;
