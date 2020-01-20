import logger from '../../../config/logger';
import InboxItem from '../model';

export const getAll = async ctx => {
	logger(`[koa@GET('inboxItems/')]`);

	try {
		const docs = await InboxItem.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	logger(`[koa@GET('inboxItems/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await InboxItem.findById(id);
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