"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.videoToken = exports.chatToken = exports.generateJSON = exports.description = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _tokens = require("../../../config/tokens");

var _models = _interopRequireDefault(require("../models"));

var _schemas = _interopRequireDefault(require("../schemas"));

var _services = _interopRequireDefault(require("../services"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var description = ctx => {
  var classes = {};
  Object.keys(_models.default).forEach(model => {
    classes[model] = _objectSpread({
      schema: _schemas.default[model]
    }, _models.default[model], {
      service: _services.default[model]
    });
  });
  ctx.body = {
    classes,
    services: _services.default
  };
  ctx.status = 200;
};

exports.description = description;

var generateJSON = ctx => {
  var models = _mongoose.default.modelNames();

  var schemas = {};
  var embedded = {}; // let schema = mongoose.model('Card').schema.paths;
  // logger(schema)

  var _loop = function _loop(model) {
    schemas[model] = {};

    var {
      schema
    } = _mongoose.default.model(model);

    var keys = Object.keys(schema.paths);
    keys = keys.map(key => {
      if (schema.paths[key].instance === 'Embedded') {
        embedded[key] = {};
        var embeddedSchema = schema.paths[key].options.type.paths;
        var embeddedKeys = Object.keys(embeddedSchema);
        embeddedKeys.forEach(subKey => {
          embedded[key][subKey] = {
            type: embeddedSchema[subKey].instance,
            required: embeddedSchema[subKey].isRequired || false,
            unique: embeddedSchema[subKey].options.unique ? true : undefined,
            isRef: !!embeddedSchema[subKey].options.ref,
            ref: embeddedSchema[subKey].options.ref || undefined
          };
        });
        return {
          name: key,
          type: schema.paths[key].instance,
          required: schema.paths[key].isRequired || false,
          unique: schema.paths[key].options.unique ? true : undefined,
          ref: schema.paths[key].options.ref || undefined
        };
      }

      return {
        name: key,
        type: schema.paths[key].instance,
        required: schema.paths[key].isRequired || false,
        unique: schema.paths[key].options.unique ? true : undefined,
        ref: schema.paths[key].options.ref || undefined
      };
    });
    keys.forEach((_ref5) => {
      var {
        name
      } = _ref5,
          rest = _objectWithoutProperties(_ref5, ["name"]);

      schemas[model][name] = _objectSpread({}, rest);
    });
    schemas[model] = _objectSpread({}, schemas[model], {
      virtials: Object.keys(schema.virtuals),
      statics: Object.keys(schema.statics),
      methods: Object.keys(schema.methods)
    });
  };

  for (var model of models) {
    _loop(model);
  } // console.dir(schemas)


  var pluralmodels = models.map(name => {
    if (name === 'Presidents') return 'Presidents';
    if (name[name.length - 1] === 's') return "".concat(name, "es");
    return "".concat(name, "s");
  });
  var services = ctx.router.stack.map((_ref) => {
    var {
      path,
      opts: {
        prefix
      },
      methods
    } = _ref;
    return {
      path,
      methods,
      prefix
    };
  });
  var serviceMap = pluralmodels.map((model, idx) => {
    var operations = services.filter(op => op.prefix.toString().toLowerCase().slice(1) === model.toLowerCase());
    operations = operations.map((_ref2) => {
      var {
        path,
        prefix,
        methods
      } = _ref2;
      methods = methods.filter(method => method !== 'HEAD');
      return {
        name: prefix.slice(1),
        path,
        methods
      };
    });
    return {
      model: models[idx],
      operations,
      embedded
    };
  });
  var directory = {};
  serviceMap.forEach((_ref3) => {
    var {
      model,
      operations
    } = _ref3;
    directory[model] = {
      service: operations[0].name,
      operations: operations.map((_ref4) => {
        var {
          path,
          methods
        } = _ref4;
        return {
          path,
          methods
        };
      })
    };
  });
  ctx.body = {
    directory,
    schemas,
    embedded
  };
  ctx.status = 200;
};

exports.generateJSON = generateJSON;

var chatToken = ctx => {
  (0, _logger.default)("POST@[api/v1/chat/token] ctx.body");
  (0, _logger.default)(ctx.request.body);
  var {
    identity
  } = ctx.request.body;
  var token = (0, _tokens.chatToken)(identity);
  ctx.body = JSON.stringify(token);
  (0, _logger.default)("POST@[api/v1/chat/token] body: ".concat(ctx.body));
};

exports.chatToken = chatToken;

var videoToken = ctx => {
  (0, _logger.default)("POST@[api/v1/video/token] ctx.body");
  (0, _logger.default)(ctx.request.body);
  var {
    identity
  } = ctx.request.body;
  var token = (0, _tokens.videoToken)(identity);
  ctx.body = JSON.stringify(token);
  (0, _logger.default)("POST@[api/v1/chat/token] body: ".concat(ctx.body));
};

exports.videoToken = videoToken;
var Controller = {
  chatToken,
  videoToken,
  description,
  generateJSON
};
var _default = Controller;
exports.default = _default;