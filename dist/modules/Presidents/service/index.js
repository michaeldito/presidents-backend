"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _Authenticate = _interopRequireDefault(require("../../../middleware/Authenticate"));

var _GameMembership = _interopRequireDefault(require("../../../middleware/GameMembership"));

var _VerifyJWT = _interopRequireDefault(require("../../../middleware/VerifyJWT"));

var _controller = require("../controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter.default({
  prefix: '/presidents'
});
router.use(_VerifyJWT.default);
router.get('/', _controller.getAll);
router.get('/details', (0, _Authenticate.default)(['Admin', 'Player']), _controller.details);
router.post('/create', (0, _Authenticate.default)(['Admin', 'Player']), _controller.create);
router.get('/:id', (0, _Authenticate.default)(['Admin', 'Player']), _controller.getOne);
router.put('/:id/join', (0, _Authenticate.default)(['Admin', 'Player']), _controller.join);
router.put('/:id/initialize', _GameMembership.default, _controller.initialize);
router.put('/:id/processTurn', _GameMembership.default, _controller.processTurn);
router.put('/:id/giveDrink', _GameMembership.default, _controller.giveDrink);
router.put('/:id/drinkDrink', _GameMembership.default, _controller.drinkDrink);
router.post('/:id/rematch', _GameMembership.default, _controller.rematch);
var _default = router;
exports.default = _default;