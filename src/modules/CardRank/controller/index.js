const CardRank = require('../model');

module.exports.getCardRanks = async ctx => {
  console.log(`[koa@GET('cardRanks/')]`);

  try {
    const docs = await CardRank.find({});
    const body = { total: docs.length, data: docs };
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
    const body = doc.toObject();
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}