import jwt from 'koa-jwt';

import config from '../config/config';
config();

console.log(`JWT SECRET: ${process.env.JWT_SECRET}`);
export default jwt({
	secret: process.env.JWT_SECRET,
	cookie: 'access_token',
	key: 'jwtdata',
	debug: true,
});
