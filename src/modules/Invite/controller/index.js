const Invite = require('../model');

module.exports.getAll = async ctx => {
  console.log(`[koa@GET('invites/')]`);

  try {
    const docs = await Invite.find({});
    const body = { total: docs.length, data: docs };
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getOne = async ctx => {
  console.log(`[koa@GET('invites/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await Invite.findById(id);
    const body = doc.toObject();
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}