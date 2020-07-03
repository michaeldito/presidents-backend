const User = require('../model');
const Presidents = require('../../Presidents/model');
const { clearCookie, setCookie } = require('koa-cookies')

module.exports.getAll = async ctx => {
  console.log(`[koa@GET('users/')]`);
  try {
    const docs = await User.find({});
    const body = { total: docs.length, data: docs };
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getOne = async ctx => {
  console.log(`[koa@GET('users/:id')]`);
  const { id } = ctx.params;
  try {
    const doc = await User.findById(id);
    const body = doc.toObject();
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.register = async ctx => {
  console.log(`[koa@POST('users/register')]`);
  const { username, email, password } = ctx.request.body;
  console.log(`username: ${username}`)
  const role = username === 'jack' ? 'Admin' : 'Player';
  let user = { 
    username, 
    email, 
    password, 
    gamesPlayed: [],
    role
  };

  try {

    user = await User.register(user);

    // Create an expiration date 10 minutes in the future for the user's access_token *cookie*
    let options = {
      type: 'web',
      _id: user._id.toHexString(),
    };

    console.log('creating aut token')
    const token = await user.generateAuthToken(options);

    ctx.cookies.set('access_token', token, {
      // Prevent the cookie from being read in XSS/injection attack
      httpOnly: true
    });
  
    console.log('auth token set');

    const body = { ...user.toObject(), loggedIn: true, registered: true };
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}


module.exports.login = async ctx => {
  console.log(`[koa@PUT('users/login')]`);
  const { username, password } = ctx.request.body;
  const credentials = { username, password };

  try {

    const user = await User.findByCredentials(credentials);

    let options = {
      type: 'web',
      _id: user._id.toHexString(),
      access: 'user'
    };
    const token = await user.generateAuthToken(options)
    console.log('user token generated');
    console.dir(token);

    ctx.cookies.set('access_token', token, {
      // Prevent the cookie from being read in XSS/injection attack
      httpOnly: true
    });
  
    const body = { ...user.toObject(), loggedIn: true };
    
    console.log(body)
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.profile = async ctx => {
  const { id } = ctx.params;

  try {
    const { username, email, gamesPlayed } = await User.findById(id);
  
    let results = await Presidents.find({gamesPlayed: {$in: gamesPlayed}});
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