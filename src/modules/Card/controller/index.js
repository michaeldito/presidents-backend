import logger from '../../../config/logger';
import Card from '../model';

export const getAll = async ctx => {
	logger(`[koa@GET('cards/')]`);

	try {
		const docs = await Card.find({});
		logger(`[koa@GET('cards/')] found ${docs.length} docs`);
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	logger(`[koa@PUT('cards/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await Card.findById(id);
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