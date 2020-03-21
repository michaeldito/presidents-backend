import mongoose from 'mongoose';

import logger from '../../../config/logger';
import { 
	chatToken as createChatToken, 
	videoToken as createVideoToken 
} from '../../../config/tokens';
import models from '../models';
import schemas from '../schemas';
import services from '../services';

export const description = ctx => {
	const classes = {};
	Object.keys(models).forEach(model => {
		classes[model] = {
			schema: schemas[model],
			...models[model],
			service: services[model],
		};
	});
	ctx.body = { classes, services };
	ctx.status = 200;
};

export const generateJSON = ctx => {
	const models = mongoose.modelNames();
	const schemas = {};
	const embedded = {};
	// let schema = mongoose.model('Card').schema.paths;
	// logger(schema)
	for (const model of models) {
		schemas[model] = {};
		const { schema } = mongoose.model(model);
		let keys = Object.keys(schema.paths);
		keys = keys.map(key => {
			if (schema.paths[key].instance === 'Embedded') {
				embedded[key] = {};
				const embeddedSchema = schema.paths[key].options.type.paths;
				const embeddedKeys = Object.keys(embeddedSchema);
				embeddedKeys.forEach(subKey => {
					embedded[key][subKey] = {
						type: embeddedSchema[subKey].instance,
						required: embeddedSchema[subKey].isRequired || false,
						unique: embeddedSchema[subKey].options.unique ? true : undefined,
						isRef: !!embeddedSchema[subKey].options.ref,
						ref: embeddedSchema[subKey].options.ref || undefined,
					};
				});
				return {
					name: key,
					type: schema.paths[key].instance,
					required: schema.paths[key].isRequired || false,
					unique: schema.paths[key].options.unique ? true : undefined,
					ref: schema.paths[key].options.ref || undefined,
				};
			}
			return {
				name: key,
				type: schema.paths[key].instance,
				required: schema.paths[key].isRequired || false,
				unique: schema.paths[key].options.unique ? true : undefined,
				ref: schema.paths[key].options.ref || undefined,
			};
		});
		keys.forEach(({ name, ...rest }) => {
			schemas[model][name] = { ...rest };
		});
		schemas[model] = {
			...schemas[model],
			virtials: Object.keys(schema.virtuals),
			statics: Object.keys(schema.statics),
			methods: Object.keys(schema.methods),
		};
	}

	// console.dir(schemas)

	const pluralmodels = models.map(name => {
		if (name === 'Presidents') return 'Presidents';
		if (name[name.length - 1] === 's') return `${name}es`;
		return `${name}s`;
	});

	const services = ctx.router.stack.map(
		({ path, opts: { prefix }, methods }) => ({
			path,
			methods,
			prefix,
		}),
	);
	const serviceMap = pluralmodels.map((model, idx) => {
		let operations = services.filter(
			op =>
				op.prefix
					.toString()
					.toLowerCase()
					.slice(1) === model.toLowerCase(),
		);
		operations = operations.map(({ path, prefix, methods }) => {
			methods = methods.filter(method => method !== 'HEAD');
			return { name: prefix.slice(1), path, methods };
		});
		return {
			model: models[idx],
			operations,
			embedded,
		};
	});
	const directory = {};

	serviceMap.forEach(({ model, operations }) => {
		directory[model] = {
			service: operations[0].name,
			operations: operations.map(({ path, methods }) => ({ path, methods })),
		};
	});
	ctx.body = { directory, schemas, embedded };
	ctx.status = 200;
};

export const chatToken = ctx => {
	logger(`POST@[api/v1/chat/token] ctx.body`);
	logger(ctx.request.body);
	const { identity } = ctx.request.body;
	const token = createChatToken(identity);
	ctx.body = JSON.stringify(token);
	logger(`POST@[api/v1/chat/token] body: ${ctx.body}`);
};

export const videoToken = ctx => {
	logger(`POST@[api/v1/video/token] ctx.body`);
	logger(ctx.request.body);
	const { identity } = ctx.request.body;
	const token = createVideoToken(identity);
	ctx.body = JSON.stringify(token);
	logger(`POST@[api/v1/chat/token] body: ${ctx.body}`);
};

const Controller = {
	chatToken,
	videoToken,
	description,
	generateJSON
};

export default Controller;