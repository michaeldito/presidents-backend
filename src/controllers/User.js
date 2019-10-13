const {User, PresidentsGame} = require('../models');

module.exports.register = async (ctx) => {
  console.log(`[koa@POST('users/register')]`);
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
  console.log(`[koa@PUT('users/login')]`);
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
    
    console.log(body)
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}


module.exports.profile = async (ctx) => {
  const { id } = ctx.params;

  try {
    const { username, email, gamesPlayed } = await User.findById(id);
  
    let results = await PresidentsGame.find({gamesPlayed: {$in: gamesPlayed}});
    results = results.map(result => {
      let {politicalRank, nextGameRank} = result;
      return {politicalRank, nextGameRank};
    })
    const body = { username, email, results };
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}