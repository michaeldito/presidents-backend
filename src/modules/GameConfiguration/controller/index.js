import logger from '../../../config/logger';
import GameConfiguration from '../model';

export const getAll = async ctx => {
	logger(`[koa@GET('gameConfigurations/')]`);

	try {
		const docs = await GameConfiguration.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	logger(`[koa@GET('gameConfigurations/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await GameConfiguration.findById(id);
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