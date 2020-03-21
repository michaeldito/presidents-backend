"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _Authenticate = _interopRequireDefault(require("../../../middleware/Authenticate"));

var _controller = require("../controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const VerifyJWT from '../../../middleware/VerifyJWT');
var router = new _koaRouter.default({
  prefix: '/users'
});
router.get('/', _controller.getAll);
router.get('/:id', (0, _Authenticate.default)(['Admin', 'Player']), _controller.getOne);
router.get('/:id/profile', (0, _Authenticate.default)(['Admin', 'Player']), _controller.profile);
router.put('/login', _controller.login);
router.post('/register', _controller.register);
var _default = router;
exports.default = _default;