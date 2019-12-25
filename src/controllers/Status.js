const { Status } = require('../models');


module.exports.getStatuses = async ctx => {
  console.log(`[koa@GET('statuses/')]`);

  try {
    const docs = await Status.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getStatus = async ctx => {
  console.log(`[koa@GET('status/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await Status.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}