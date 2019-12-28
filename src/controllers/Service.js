const mongoose = require('mongoose');
const { chatToken, videoToken } = require('../config/tokens');
const models = require('../config/models.json');
const schemas = require('../config/schemas.json');
const services = require('../config/services.json');

module.exports.description = ctx => {
  let classes = {}
  Object.keys(models).forEach(model => {
    classes[model] = {
      schema: schemas[model], 
      ...models[model],
      service: services[model]
    };
  });
  ctx.body = { classes, services };
  ctx.status = 200;
};

module.exports.generateJSON = ctx => {
  const models = mongoose.modelNames();
  let schemas = {};
  let embedded = {};
  // let schema = mongoose.model('Card').schema.paths;
  // console.log(schema)
  for (let model of models) {
    schemas[model] = {};
    let schema = mongoose.model(model).schema;
    let keys = Object.keys(schema.paths);
    keys = keys.map(key => {
      if (schema.paths[key].instance === 'Embedded') {
        embedded[key] = {};
        let embeddedSchema = schema.paths[key].options.type.paths;
        let embeddedKeys = Object.keys(embeddedSchema);
        embeddedKeys.forEach(subKey => {
          embedded[key][subKey] = {
            type: embeddedSchema[subKey].instance,
            required: embeddedSchema[subKey].isRequired || false,
            unique: embeddedSchema[subKey].options.unique ? true : undefined,
            isRef: !! embeddedSchema[subKey].options.ref,
            ref: embeddedSchema[subKey].options.ref || undefined
          }
        });
        return {
          name: key,
          type: schema.paths[key].instance,
          required: schema.paths[key].isRequired || false,
          unique: schema.paths[key].options.unique ? true : undefined,
          ref: schema.paths[key].options.ref || undefined,
        }
      }
      return {
        name: key,
        type: schema.paths[key].instance,
        required: schema.paths[key].isRequired || false,
        unique: schema.paths[key].options.unique ? true : undefined,
        ref: schema.paths[key].options.ref || undefined,
      }
    });
    keys.forEach(({name, ...rest}) => {
      schemas[model][name] = {...rest};
    });
    schemas[model] = {
      ...schemas[model],
      virtials: Object.keys(schema.virtuals),
      statics: Object.keys(schema.statics),
      methods: Object.keys(schema.methods),
    }
  }

  //console.dir(schemas)

  const pluralmodels = models.map(name => {
    if (name === 'Presidents')
      return 'Presidents';
    if (name[name.length-1] === 's')
      return `${name}es`;
    return `${name}s`;
  });
  
  const services = ctx.router.stack.map(({path, opts: { prefix }, methods}) => ({path, methods, prefix}));
  const serviceMap = pluralmodels.map((model, idx) => {
    let operations = services.filter(op => op.prefix.toString().toLowerCase().slice(1) === model.toLowerCase());
    operations = operations.map(({path, prefix, methods}) => {
      methods = methods.filter(method => method !== 'HEAD');
      return { name: prefix.slice(1), path, methods };
    });
    return {
      model: models[idx],
      operations,
      embedded
    }
  });
  let directory = {};

  serviceMap.forEach(({ model, operations }) => {
    directory[model] = {
      service: operations[0].name,
      operations: operations.map(({path, methods}) => ({path, methods}))
    };
  })
  ctx.body = { directory, schemas, embedded };
  ctx.status = 200;
}

module.exports.chatToken = ctx => {
  console.log(`POST@[api/v1/chat/token] ctx.body`)
  console.log(ctx.request.body)
  const { identity } = ctx.request.body;
  const token = chatToken(identity);
  ctx.body = JSON.stringify(token);
  console.log(`POST@[api/v1/chat/token] body: ${ctx.body}`);
};

module.exports.videoToken = ctx => {
  console.log(`POST@[api/v1/video/token] ctx.body`)
  console.log(ctx.request.body)
  const { identity } = ctx.request.body;
  const token = videoToken(identity);
  ctx.body = JSON.stringify(token);
  console.log(`POST@[api/v1/chat/token] body: ${ctx.body}`);
};