"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _Authenticate = _interopRequireDefault(require("../../../middleware/Authenticate"));

var _VerifyJWT = _interopRequireDefault(require("../../../middleware/VerifyJWT"));

var _controller = require("../controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter.default({
  prefix: '/politicalRanks'
});
router.use(_VerifyJWT.default);
router.get('/', (0, _Authenticate.default)(['Admin']), _controller.getAll);
router.get('/:id', (0, _Authenticate.default)(['Admin']), _controller.getOne);
var _default = router;
exports.default = _default;