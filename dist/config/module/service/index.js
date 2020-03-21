"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _controller = _interopRequireDefault(require("../controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  getAll,
  getOne
} = _controller.default;
var router = new _koaRouter.default({
  prefix: '/model'
});
router.get('/', getAll);
router.get('/:id', getOne);
var _default = router;
exports.default = _default;