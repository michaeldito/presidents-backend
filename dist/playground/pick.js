"use strict";

var utils = require('../utils');

var obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};
console.log(utils.pick(obj, ['a', 'c']));