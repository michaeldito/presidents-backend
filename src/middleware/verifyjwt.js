import jwt from 'koa-jwt';

export default jwt({
	secret: process.env.JWT_SECRET,
	cookie: 'access_token',
	key: 'jwtdata',
	debug: true,
});
