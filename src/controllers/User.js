

class UserController {
  constructor() {

  }

  static async create(ctx) {

    ctx.status = 200;
    ctx.body = ctx;
  }

  static async getUser(ctx) {
    
    ctx.body = {};
    ctx.status = 200;
  }
}



module.exports = UserController;
