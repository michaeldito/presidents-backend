import Suit from '../model';

export const getAll = async ctx => {
	console.log(`[koa@GET('suits/')]`);

	try {
		const docs = await Suit.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

export const getOne = async ctx => {
	console.log(`[koa@GET('suit/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await Suit.findById(id);
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