const { InboxItem } = require('../models');


module.exports.getInboxItems = async ctx => {
  console.log(`[koa@GET('inboxItems/')]`);

  try {
    const docs = await InboxItem.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getInboxItem = async ctx => {
  console.log(`[koa@GET('inboxItems/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await InboxItem.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}