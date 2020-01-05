const { Suit } = require('../models');


module.exports.getSuits = async ctx => {
  console.log(`[koa@GET('suits/')]`);

  try {
    const docs = await Suit.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getSuit = async ctx => {
  console.log(`[koa@GET('suit/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await Suit.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}