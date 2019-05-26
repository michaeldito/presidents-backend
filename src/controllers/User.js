const User = require('../models');
const setAccessToken = require('../controllers/Authentication/setAccessToken')

class UserController {
  constructor() {

  }

  // if username does not exist -> add user
  // result: user added if name does not exist
  // returns: the user
  static async create(ctx) {
    const { username, password } = ctx.request.body;
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      console.log('[controllers:user:create] username already exists');
      ctx.status = 400;
      ctx.body = 'Username already exists';
      return
    }

    let user = new User({
			username,
			password,
		})

    await user.save();
    
    setAccessToken(ctx, username);

    const body = {
      username: user.username,
      loggedIn: true
    }
    ctx.status = 200;
    ctx.body = body;
  }
}



module.exports = UserController;
