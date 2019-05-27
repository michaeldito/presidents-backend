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

const middleware = [
  bodyParser(), 
  logger(), 
  cors(),
  errorHandler
];


module.exports = middleware;
