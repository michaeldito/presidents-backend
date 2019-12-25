const { GameStatus } = require('../models');


module.exports.getGameStatuses = async ctx => {
  console.log(`[koa@GET('gameStatuses/')]`);

  try {
    const docs = await GameStatus.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getGameStatus = async ctx => {
  console.log(`[koa@GET('gameStatuses/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await GameStatus.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}