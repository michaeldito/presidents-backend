import logger from '../../../config/logger';
import Invite from '../model';

export const getAll = async ctx => {
	logger(`[koa@GET('invites/')]`);

	try {
		const docs = await Invite.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	logger(`[koa@GET('invites/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await Invite.findById(id);
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