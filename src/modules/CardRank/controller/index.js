import logger from '../../../config/logger';
import CardRank from '../model';

export const getAll = async ctx => {
	logger(`[koa@GET('cardRanks/')]`);

	try {
		const docs = await CardRank.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	logger(`[koa@PUT('cardRank/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await CardRank.findById(id);
		const body = doc.toObject();
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

const Controller = {
	getAll, 
	getOne
};

export default Controller;
