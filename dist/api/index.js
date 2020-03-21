"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _Authenticate = _interopRequireDefault(require("../middleware/Authenticate"));

var Modules = _interopRequireWildcard(require("../modules"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  Card,
  CardRank,
  Game,
  GameConfiguration,
  GameStatus,
  PoliticalRank,
  Presidents,
  Service,
  Status,
  Suit,
  User
} = Modules;
var router = new _koaRouter.default({
  prefix: '/api/v1'
});
router.get('/', Service.Controller.description);
router.get('/json', Service.Controller.generateJSON);
router.post('/chat/token', (0, _Authenticate.default)(['Admin', 'Player']), Service.Controller.chatToken);
router.post('/video/token', (0, _Authenticate.default)(['Admin', 'Player']), Service.Controller.videoToken);
router.get('/poop', ctx => {
  ctx.app.emit('logging', 'poop', ctx);
});
router.get('/logging', ctx => {
  ctx.body = require('../../debug.log');
});
var api = router.use(Card.Service.routes(), CardRank.Service.routes(), Game.Service.routes(), GameConfiguration.Service.routes(), GameStatus.Service.routes(), PoliticalRank.Service.routes(), Presidents.Service.routes(), Status.Service.routes(), Suit.Service.routes(), User.Service.routes());
var _default = api;
exports.default = _default;