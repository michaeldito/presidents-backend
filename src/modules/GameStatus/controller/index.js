import GameStatus from '../model';

export const getAll = async ctx => {
	console.log(`[koa@GET('gameStatuses/')]`);

	try {
		const docs = await GameStatus.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	console.log(`[koa@GET('gameStatuses/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await GameStatus.findById(id);
		const body = doc.toObject();
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};
