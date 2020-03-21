"use strict";

var _tests = require("../modules/tests");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var model = process.argv[process.argv.length - 1];

var testSuite = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (model) {
    switch (model) {
      case 'card':
        yield _tests.tests.cardTests();
        break;

      case 'cardrank':
        yield _tests.tests.cardRankTests();
        break;

      case 'game':
        yield _tests.tests.gameTests();
        break;

      case 'gameconfiguration':
        yield _tests.tests.gameConfigTests();
        break;

      case 'gamestatus':
        yield _tests.tests.gameStatusTests();
        break;

      case 'politicalrank':
        yield _tests.tests.politicalRankTests();
        break;

      case 'presidents':
        yield _tests.tests.presidentsTests();
        break;

      case 'status':
        yield _tests.tests.statusTests();
        break;

      case 'suit':
        yield _tests.tests.suitTests();
        break;

      case 'user':
        yield _tests.tests.userTests();
        break;

      default:
        yield _tests.tests.suitTests();
        yield _tests.tests.cardRankTests();
        yield _tests.tests.cardTests();
        yield _tests.tests.gameConfigTests();
        yield _tests.tests.politicalRankTests();
        yield _tests.tests.statusTests();
        yield _tests.tests.gameStatusTests();
        yield _tests.tests.userTests();
        yield _tests.tests.gameTests();
        yield _tests.tests.presidentsTests();
    }
  });

  return function testSuite(_x) {
    return _ref.apply(this, arguments);
  };
}();

_asyncToGenerator(function* () {
  try {
    yield testSuite(model);
  } catch (e) {
    console.log('[Unit:Test] test suite failed');
    console.log(e);
  }
})();