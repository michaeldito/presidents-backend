const jwt = require('jsonwebtoken');

module.exports = (ctx, user) => {
  console.log(user);
  const expiresAt = Date.now() + (20 * 60 * 1000);

  let options = {
    type: 'web',
    exp: Math.floor(expiresAt / 1000 + (60 * 1)), // expire the access_token 1m after the cookie
    user
  };

  const token = jwt.sign(options, process.env.JWT_KEY);

  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    expires: new Date(expiresAt),
  });
};