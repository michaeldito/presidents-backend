import logger from '../../../config/logger';
import Status from '../model';

export const getAll = async ctx => {
	logger(`[koa@GET('statuses/')]`);

	try {
		const docs = await Status.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	logger(`[koa@GET('status/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await Status.findById(id);
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
