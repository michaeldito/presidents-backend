const { GameConfiguration } = require('../models');


module.exports.getGameConfigurations = async ctx => {
  console.log(`[koa@GET('gameConfigurations/')]`);

  try {
    const docs = await GameConfiguration.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getGameConfiguration = async ctx => {
  console.log(`[koa@GET('gameConfigurations/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await GameConfiguration.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}