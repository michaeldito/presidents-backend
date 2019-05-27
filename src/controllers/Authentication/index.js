const setAccessToken = require('./setAccessToken');
const User = require('../../models/user');

// const body = _.pick(req.body, ['email', 'password']);
// const user = await User.findByCredentials(body.email, body.password)
// const token = await  user.generateAuthToken();
// res.header('x-auth', token).send(user);

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



// old auth method - not tested or updated
var authenticate = async (req, res, next) => {
  try {
    // get the value of the header for x-auth to verify the token and user
    var token = req.header('x-auth');
    // find the right user associated with the token
    const user = await User.findByToken(token);

    if (!user) {
        // valid toke, but no user, reject this Promise
        // resulting in a 401
        return Promise.reject();
        // now we jump immediately to the catch below
    }

      // instead of sending response
      // set the req.user equal to the user we found 
      // and the same for token
    req.user = user;
    req.token = token;
    next();
  } catch (e)  {
    // 401 status means authentication is required and the user
    // must have authenticated incorrectly
    res.status(401).send();
  };
};