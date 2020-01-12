const PoliticalRank = require('../model');

module.exports.getPoliticalRanks = async ctx => {
  console.log(`[koa@GET('politicalRanks/')]`);

  try {
    const docs = await PoliticalRank.find({});
    const body = { total: docs.length, data: docs };
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}

module.exports.getPoliticalRank = async ctx => {
  console.log(`[koa@GET('politicalRanks/:id')]`);
  const { id } = ctx.params;

  try {
    const doc = await PoliticalRank.findById(id);
    const body = doc.toObject();
    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, err);
  }  
}