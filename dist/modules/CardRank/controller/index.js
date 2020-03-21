"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getOne = exports.getAll = void 0;

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _model = _interopRequireDefault(require("../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getAll = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@GET('cardRanks/')]");

    try {
      var docs = yield _model.default.find({});
      var body = {
        total: docs.length,
        data: docs
      };
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function getAll(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getAll = getAll;

var getOne = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    (0, _logger.default)("[koa@PUT('cardRank/:id')]");
    var {
      id
    } = ctx.params;

    try {
      var doc = yield _model.default.findById(id);
      var body = doc.toObject();
      ctx.status = 200;
      ctx.body = body;
    } catch (err) {
      ctx.throw(400, err);
    }
  });

  return function getOne(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getOne = getOne;
var Controller = {
  getAll,
  getOne
};
var _default = Controller;
exports.default = _default;