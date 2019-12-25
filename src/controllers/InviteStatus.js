const { InviteStatus } = require('../models');


module.exports.getInviteStatuses = async ctx => {
  console.log(`[koa@GET('inviteStatuses/')]`);

  try {
    const docs = await InviteStatus.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getInviteStatus = async ctx => {
  console.log(`[koa@GET('inviteStatuses/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await InviteStatus.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}