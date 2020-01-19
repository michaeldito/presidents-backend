import Model from '../model';

const getAll = async function(ctx) {
	console.log(`[koa@GET('modelService/getAll')]`);

	try {
		const docs = await Model.find({});
		const body = { total: docs.length, data: docs };
		ctx.status = 200;
		ctx.body = body;
	} catch (err) {
		ctx.throw(400, err);
	}
};

const getOne = async function(ctx) {
	console.log(`[koa@GET('modelService/:id')]`);
	const { id } = ctx.params;

	try {
		const doc = await Model.findById(id);
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