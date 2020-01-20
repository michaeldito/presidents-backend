import logger from '../config/logger';
import User from '../modules/User/model';

const Authenticate = allowedRoles => {
	return async (ctx, next) => {
		const token = ctx.cookies.get('access_token');
		const doc = await User.findByToken(token);

		if (!doc) {
			logger(`[Authentication] no user found for token`);
			ctx.body = `[Authentication] no user found for token`;
			return false;
		}
		if (!allowedRoles.find(role => role === doc.role)) {
			logger(
				`[Authentication] DENIED - not in security groups ${allowedRoles}`,
			);
			ctx.body = `[Authentication] DENIED - not in security groups ${allowedRoles}`;
			return false;
		}

		logger(
			`[Authentication] APPROVED - user is in 1 of secury groups ${allowedRoles}`,
		);
		ctx.body = `[Authentication] APPROVED - user is in 1 of secury groups ${allowedRoles}`;
		return next();
	};
};

export default Authenticate;