const {User} = require('../models');

module.exports.register = async (ctx) => {
  const { username, email, password } = ctx.request.body;
  let user = { username, email, password };

  try {
    user = await User.register(user);

    const cookieExpiration = Date.now() + (20 * 60 * 1000);

    let options = {
      type: 'web',
      exp: Math.floor(cookieExpiration / 1000 + (60 * 1)), // expire the access_token 1m after the cookie
      _id: user._id.toHexString(),
      access: 'user'
    };
  
    const token = await user.generateAuthToken(options)
  
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      expires: new Date(cookieExpiration),
    });
  
    const body = { ...user.toObject(), loggedIn: true };
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const credentials = { username, password };

  try {
    const user = await User.findByCredentials(credentials);
    const cookieExpiration = Date.now() + (20 * 60 * 1000);

    let options = {
      type: 'web',
      exp: Math.floor(cookieExpiration / 1000 + (60 * 1)), // expire the access_token 1m after the cookie
      _id: user._id.toHexString(),
      access: 'user'
    };
  
    const token = await user.generateAuthToken(options)
  
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      expires: new Date(cookieExpiration),
    });
  
    const body = { ...user.toObject(), loggedIn: true };
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.profile = async (ctx) => {
  const { id } = ctx.params.id;

  try {
    const { username, email, gamesPlayed, politicalRank, nextGameRank } = await User.findById(id);
  
    const body = { username, email, gamesPlayed, politicalRank, nextGameRank };
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}