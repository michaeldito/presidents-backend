"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.test = exports.drop = exports.init = void 0;

var _chai = _interopRequireDefault(require("chai"));

var _expect = _interopRequireDefault(require("expect"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _ = _interopRequireDefault(require("."));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var chaiexpect = _chai.default.expect;

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var count = yield _.default.countDocuments({});
    if (count === 9) return Promise.resolve();

    var instances = _data.default.map(user => new _.default(user));

    var promises = instances.map(instance => instance.save());
    yield Promise.all(promises);
  });

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

exports.init = init;

var drop = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    yield _.default.deleteMany({});
  });

  return function drop() {
    return _ref2.apply(this, arguments);
  };
}();

exports.drop = drop;

var test = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* () {
    return describe('User', function () {
      before( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.connect();
        yield drop();
      }));
      after( /*#__PURE__*/_asyncToGenerator(function* () {
        yield _db.default.close();
      }));
      describe('#init()', function () {
        it('verify it initializes 9 user documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield init();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(9);
        }));
        describe('validations', function () {
          it('username is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var user = {
              password: 'password'
            };
            var instance = new _.default(user);
            var error = instance.validateSync();
            var message = 'A username is required to create a user.';
            (0, _expect.default)(error.errors.username.message).toBe(message);
          }));
          it('username must be unique', /*#__PURE__*/_asyncToGenerator(function* () {
            var user = {
              username: 'tommypastrami',
              password: 'cheese'
            };
            var instance = new _.default(user);
            var message = 'Error, expected `username` to be unique. Value: `tommypastrami`';
            instance.save(error => {
              (0, _expect.default)(error.errors.username.message).toBe(message);
            });
          }));
          it('password is required', /*#__PURE__*/_asyncToGenerator(function* () {
            var user = {
              username: 'username'
            };
            var instance = new _.default(user);
            var error = instance.validateSync();
            var message = 'A password is required to create a user.';
            (0, _expect.default)(error.errors.password.message).toBe(message);
          }));
        });
      });
      describe('#register(user)', function () {
        it('should hash the password and create a user', /*#__PURE__*/_asyncToGenerator(function* () {
          var user = {
            username: 'mcdito13',
            password: '1234',
            email: 'mcdito13@gmail.com'
          };
          yield _.default.register(user);
          var doc = yield _.default.findOne({
            username: user.username
          });
          (0, _expect.default)(doc.username).toBe('mcdito13');
          (0, _expect.default)(doc.password[0]).toBe('$');
        }));
      });
      describe('#findByUsername(username)', function () {
        it('should return instance if successful', /*#__PURE__*/_asyncToGenerator(function* () {
          var doc = yield _.default.findByUsername('bella');
          (0, _expect.default)(doc.username).toBe('bella');
        }));
        it('should not return instance if unsuccessful', /*#__PURE__*/_asyncToGenerator(function* () {
          var doc = yield _.default.findByUsername('foo');
          (0, _expect.default)(doc).toBeFalsy();
        }));
      });
      describe('findByCredentials(username, password)', function () {
        it('should return instance if successful', /*#__PURE__*/_asyncToGenerator(function* () {
          var credentials = {
            username: 'mcdito13',
            password: '1234',
            email: 'mcdito13@gmail.com'
          };
          var doc = yield _.default.findByCredentials(credentials);
          (0, _expect.default)(doc).toBeTruthy();
        }));
        it('should not return instance if unsuccessful', /*#__PURE__*/_asyncToGenerator(function* () {
          var user = {
            username: 'mcdito13',
            password: '4321',
            email: 'mcdito13@gmail.com'
          };

          try {
            yield _.default.findByCredentials(user.username, user.password);
          } catch (err) {
            (0, _expect.default)(err.message).toBe("username doesn't exist.");
          }
        }));
      });
      describe('#findByToken(token)', function () {
        it('verify it does the right thing', /*#__PURE__*/_asyncToGenerator(function* () {}));
      });
      describe('#drop()', function () {
        it('verify it deletes all user documents', /*#__PURE__*/_asyncToGenerator(function* () {
          yield drop();
          var docs = yield _.default.find({});
          (0, _expect.default)(docs.length).toBe(0);
        }));
      });
    });
  });

  return function test() {
    return _ref3.apply(this, arguments);
  };
}();

exports.test = test;
var Test = {
  init,
  drop,
  test
};
var _default = Test;
exports.default = _default;