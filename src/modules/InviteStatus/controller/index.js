const InviteStatus = require('../model');

module.exports.getAll = async ctx => {
  console.log(`[koa@GET('inviteStatuses/')]`);

  try {
    const docs = await InviteStatus.find({});
    const body = { total: docs.length, data: docs };
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getOne = async ctx => {
  console.log(`[koa@GET('inviteStatuses/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await InviteStatus.findById(id);
    const body = doc.toObject();
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}