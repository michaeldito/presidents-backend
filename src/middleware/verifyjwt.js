const jwt = require('koa-jwt');

module.exports = jwt({
  secret: "1234",
  cookie: 'access_token',
  key: 'jwtdata',
  debug: true
});
