const { Invite } = require('../models');


module.exports.getInvites = async ctx => {
  console.log(`[koa@GET('invites/')]`);

  try {
    const docs = await Invite.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getInvite = async ctx => {
  console.log(`[koa@GET('invites/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await Invite.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}