const { Card } = require('../models');

module.exports.getCards = async ctx => {
  console.log(`[koa@GET('cards/')]`);

  try {
    const docs = await Card.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getCard = async ctx => {
  console.log(`[koa@PUT('cards/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await Card.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}