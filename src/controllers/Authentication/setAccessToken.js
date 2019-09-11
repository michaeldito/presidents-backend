const jwt = require('./node_modules/jsonwebtoken');

function setAccessToken(ctx, user) {
  const expDate = Date.now() + (20 * 60 * 1000);

  let options = {
    type: 'web',
    exp: Math.floor(expDate / 1000 + (60 * 1)), // expire the access_token 1m after the cookie
    user
  };

  const token = jwt.sign(options, process.env.JWT_KEY);

  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    expires: new Date(expDate)
  });
}

module.exports = setAccessToken;
