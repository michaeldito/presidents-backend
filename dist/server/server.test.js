"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = describe('Koa Server', function () {
  before( /*#__PURE__*/_asyncToGenerator(function* () {}));
  after( /*#__PURE__*/_asyncToGenerator(function* () {}));
  afterEach(function () {
    app.close();
  });
  describe('routes: /api/v1', function () {
    it('should respond with /api/v1', /*#__PURE__*/_asyncToGenerator(function* () {
      var response = yield request(app).get('/api/v1');
      expect(response.status).toEqual(200);
      expect(response.type).toEqual('application/json');
      expect(response.body.data).toEqual('/api/v1');
    }));
  });
  describe('routes: /api/v1/error', function () {
    it('koa should catch error', /*#__PURE__*/_asyncToGenerator(function* () {
      var response = yield request(app).get('/api/v1/error');
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Error Message');
    }));
  });
  describe('routes: /api/v1/no-way', function () {
    it('koa event handling tests', /*#__PURE__*/_asyncToGenerator(function* () {//const response = await request(app).get('/api/v1/no-way');
    }));
  });
});

exports.default = _default;