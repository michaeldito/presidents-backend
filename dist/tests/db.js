"use strict";

var _db = require("../config/db");

var _test = require("../modules/Card/model/test");

var _test2 = require("../modules/CardRank/model/test");

var _test3 = require("../modules/GameConfiguration/model/test");

var _test4 = require("../modules/GameStatus/model/test");

var _test5 = require("../modules/PoliticalRank/model/test");

var _test6 = require("../modules/Presidents/model/test");

var _test7 = require("../modules/Suit/model/test");

var _test8 = require("../modules/User/model/test");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ACTION = process.env.DB_ACTION; // inits

function dbInit() {
  return _dbInit.apply(this, arguments);
}

function _dbInit() {
  _dbInit = _asyncToGenerator(function* () {
    console.log('[Database] initializing database...');
    yield (0, _db.connect)();
    yield Promise.all([(0, _test2.init)(), (0, _test7.init)()]);
    yield Promise.all([(0, _test.init)(), (0, _test8.init)(), (0, _test4.init)(), (0, _test5.init)()]);
    yield (0, _test3.init)();
    yield (0, _db.close)();
    console.log('[Database] done');
  });
  return _dbInit.apply(this, arguments);
}

function dbDrop() {
  return _dbDrop.apply(this, arguments);
}

function _dbDrop() {
  _dbDrop = _asyncToGenerator(function* () {
    console.log('[Database] dropping database...');
    yield (0, _db.connect)();
    yield Promise.all([(0, _test2.drop)(), (0, _test7.drop)(), (0, _test.drop)(), (0, _test8.drop)(), (0, _test4.drop)(), (0, _test3.drop)(), (0, _test5.drop)(), (0, _test6.drop)()]);
    yield (0, _db.close)();
    console.log('[Database] done');
  });
  return _dbDrop.apply(this, arguments);
}

function runCommand() {
  return _runCommand.apply(this, arguments);
}

function _runCommand() {
  _runCommand = _asyncToGenerator(function* () {
    console.log('[Database] running command: initGameStatuses()');
    yield (0, _db.connect)();
    yield (0, _test4.init)();
    yield (0, _db.close)();
    console.log('[Database] done');
  });
  return _runCommand.apply(this, arguments);
}

_asyncToGenerator(function* () {
  try {
    if (ACTION === 'init') {
      yield dbInit();
    }

    if (ACTION === 'drop') {
      yield dbDrop();
    }

    if (ACTION === 'command') {
      yield runCommand();
    }
  } catch (e) {
    console.log('[Database] db init/drop messed up');
    console.log(e);
  }
})();