const setAccessToken = require('./setAccessToken');
const User = require('../../models/user');

module.exports = async ctx => {
  console.log('authenticating user');
  const { username, password } = ctx.request.body;

  // verify user has an account
  const user = await User.findOne({ username, password });
  if (! user) {
    console.log('[Authentication] user does not exist or invalid password');
    ctx.status = 400;
    ctx.body = 'Username and password do not match a user.'
    return
  }
  
  setAccessToken(ctx, ctx.request.body.username);

  const body = {
    username: user.username,
    loggedIn: true
  }
  ctx.status = 200;
  ctx.body = body;
};