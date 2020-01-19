const utils = require('../utils');

const obj = { a: 1, b: 2, c: 3, d: 4 };

console.log(utils.pick(obj, ['a', 'c']));
