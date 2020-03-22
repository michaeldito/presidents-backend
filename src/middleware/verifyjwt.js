const jwt = require('koa-jwt');

console.log(process.env.JWT_SECRET);

module.exports = jwt({
  secret: process.env.JWT_SECRET,
  cookie: 'access_token',
  key: 'jwtdata',
  debug: true
});
