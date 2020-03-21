"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.pick = void 0;

// {a: 1, b: 2, c: 3 }, ['b', 'c'] => {b, c}
var pick = (obj, feilds) => {
  var newObj = {};
  feilds.forEach(feild => {
    newObj[feild] = obj[feild];
  });
  return newObj;
};

exports.pick = pick;
var Utils = {
  pick
};
var _default = Utils;
exports.default = _default;