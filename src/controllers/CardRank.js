const { CardRank } = require('../models');


module.exports.getCardRanks = async ctx => {
  console.log(`[koa@GET('cardRanks/')]`);

  try {
    const docs = await CardRank.find({});
    const body = { total: docs.length, data: docs };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getCardRank = async ctx => {
  console.log(`[koa@PUT('cardRank/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await CardRank.findById(id);
    const body = { ...doc.toObject() };
    console.log(body);
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}