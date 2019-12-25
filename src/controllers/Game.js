const { Game } = require('../models');


module.exports.getGames = async ctx => {
  console.log(`[koa@GET('games/')]`);

  try {
    const docs = await Game.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getGame = async ctx => {
  console.log(`[koa@GET('games/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await Game.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}