"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tests = void 0;

var _test = require("./Card/model/test");

var _test2 = require("./CardRank/model/test");

var _test3 = require("./Game/model/test");

var _test4 = require("./GameConfiguration/model/test");

var _test5 = require("./GameStatus/model/test");

var _test6 = require("./PoliticalRank/model/test");

var _test7 = require("./Presidents/model/test");

var _test8 = require("./Status/model/test");

var _test9 = require("./Suit/model/test");

var _test10 = require("./User/model/test");

var tests = {
  suitTests: _test9.test,
  cardRankTests: _test2.test,
  cardTests: _test.test,
  gameConfigTests: _test4.test,
  politicalRankTests: _test6.test,
  statusTests: _test8.test,
  gameStatusTests: _test5.test,
  userTests: _test10.test,
  gameTests: _test3.test,
  presidentsTests: _test7.test
};
exports.tests = tests;