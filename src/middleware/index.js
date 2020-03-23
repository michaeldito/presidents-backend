const compose = require('koa-compose');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

const setCorsHeaders = async (ctx, next) => {
  const origin = ctx.get('Origin');
  if (ctx.method !== 'OPTIONS') {
    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Credentials', 'true');
  } else if (ctx.get('Access-Control-Request-Method')) {
    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Max-Age', '42');
    ctx.set('Access-Control-Allow-Credentials', 'true');
  }
  await next();
};

const middleware = [
  errorHandler,
  bodyParser(), 
  logger(), 
  setCorsHeaders,
  cors({
    credentials: true,
    exposeHeaders: ['Access-Token', 'Cookie']
  }),
];


module.exports = compose(middleware);
