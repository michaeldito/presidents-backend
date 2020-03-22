import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import logger from 'koa-logger';

const errorHandler = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.status || 500;
		ctx.body = err.message;
		ctx.app.emit('error', err, ctx);
	}
};

const middleware = [
	errorHandler,
	bodyParser(),
	logger(),
	cors({
		credentials: true,
		exposeHeaders: ['Access-Token', 'Cookie'],
		keepHeadersOnError: true
	})
];

const Middleware = compose(middleware);

export default Middleware;
