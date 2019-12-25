const mongoose = require('mongoose');
const { chatToken, videoToken } = require('../config/tokens');

module.exports.description = ctx => {
  const modelNames = mongoose.modelNames();
  let schemas = [];
  for (let name of modelNames) {
    let schema = mongoose.model(name).schema.paths;
    let keys = Object.keys(schema);
    keys = keys.map(key => {
      return {
        key,
        type: schema[key].instance,
        required: schema[key].isRequired || false,
        isRef: !! schema[key].options.ref,
        ref: schema[key].options.ref || undefined
      }
    });
    let data = {};
    let obj = { [name]: data};
    keys.forEach(({ key, ...rest}) => {
      data[key] = { ...rest }
    })
    schemas.push(obj);
  }

  console.dir(schemas)

  const pluralModelNames = modelNames.map(name => {
    if (name === 'Presidents')
      return 'Presidents';
    if (name[name.length-1] === 's')
      return `${name}es`;
    return `${name}s`;
  });
  
  const services = ctx.router.stack.map(({path, opts: { prefix }, methods}) => ({path, methods, prefix}));
  const serviceMap = pluralModelNames.map((modelName, idx) => {
    let operations = services.filter(op => op.prefix.toString().toLowerCase().slice(1) === modelName.toLowerCase());
    operations = operations.map(({path, methods}) => {
      methods = methods.filter(method => method !== 'HEAD');
      return { path, methods };
    });
    return {
      service: modelNames[idx],
      operations
    }
  });

  ctx.body = { total: serviceMap.length, data: serviceMap, schemas };
  ctx.status = 200;
}

module.exports.chatToken = ctx => {
  console.log(`POST@[api/v1/chat/token] ctx.body`)
  console.log(ctx.request.body)
  const {identity } = ctx.request.body;
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