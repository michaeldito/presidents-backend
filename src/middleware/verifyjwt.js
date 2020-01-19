const jwt = require('koa-jwt');

module.exports = jwt({
  secret: process.env.JWT_SECRET,
  cookie: 'access_token',
  key: 'jwtdata',
  debug: true
});
