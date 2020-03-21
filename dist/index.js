"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config/config"));

var _http = _interopRequireDefault(require("http"));

var _koa = _interopRequireDefault(require("koa"));

var _socket = _interopRequireDefault(require("socket.io"));

var _api = _interopRequireDefault(require("./api"));

var _db = require("./config/db");

var _logger = _interopRequireDefault(require("./config/logger"));

var _middleware = _interopRequireDefault(require("./middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _config.default)();
var app = new _koa.default();

var server = _http.default.createServer(app.callback());

app.io = new _socket.default(server);
app.use(_middleware.default);
app.use(_api.default.routes(), _api.default.allowedMethods());
app.on('error', (err, ctx) => {
  (0, _logger.default)(err.message);
});
app.on('ui msg', (msg, ctx) => {
  (0, _logger.default)(msg);
});
app.io.on('connection', client => {
  (0, _logger.default)("[Socket] new client connected: ".concat(client.id));
  console.log("[Socket] new client connected: ".concat(client.id));
  client.on('disconnect', () => (0, _logger.default)('[Socket] client disconnected'));
  client.on('msg from ui', data => app.emit('ui msg', data));
});
var port = process.env.PORT || 8080;
server = server.listen(port, () => (0, _logger.default)("[Server] listening on http port ".concat(port)), console.log("[Server] listening on http port ".concat(port)));

_asyncToGenerator(function* () {
  yield (0, _db.connect)();
})();

var _default = server;
exports.default = _default;