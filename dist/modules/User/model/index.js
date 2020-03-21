"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var UserSchema = new _mongoose.default.Schema({
  username: {
    type: String,
    required: [true, 'A username is required to create a user.'],
    trim: true,
    minlength: 1,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    minlength: 1,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: [true, 'A password is required to create a user.'],
    minlength: 1
  },
  gamesPlayed: {
    type: [_mongoose.default.Schema.Types.ObjectId],
    ref: 'Game'
  },
  token: {
    type: String
  },
  role: {
    type: String
  }
});

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({
    username
  });
};

UserSchema.statics.findRandoms = function (howMany) {
  return this.find({}).limit(howMany);
};

UserSchema.statics.register = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (user) {
    (0, _logger.default)("[User@register()] registering ".concat(user.username));
    var salt = yield _bcrypt.default.genSalt(10);
    var hash = yield _bcrypt.default.hash(user.password, salt);
    user.password = hash;
    var instance = new User(user);
    yield instance.save();
    return instance;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

UserSchema.methods.generateAuthToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (options) {
    (0, _logger.default)("[User@generateAuthToken()] creating auth token");

    var token = _jsonwebtoken.default.sign(options, process.env.JWT_SECRET).toString();

    this.token = token;
    yield this.save();
    return token;
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

UserSchema.statics.findByCredentials = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (_ref3) {
    var {
      username,
      password
    } = _ref3;
    (0, _logger.default)("[User@findByCredentials()] searching for ".concat(username));
    var user = yield this.findOne({
      username
    });
    if (!user) return Promise.reject(new Error("username doesn't exist."));
    return new Promise((resolve, reject) => {
      _bcrypt.default.compare(password, user.password, (err, res) => {
        if (res) resolve(user);else reject();
      });
    });
  });

  return function (_x3) {
    return _ref4.apply(this, arguments);
  };
}();

UserSchema.statics.findByToken = function (token) {
  var decoded;

  try {
    decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Promise.reject('invalid token');
  } // query a nested doc


  return this.findOne({
    token
  });
};

UserSchema.plugin(_mongooseUniqueValidator.default);
UserSchema.virtual('kind').get(function () {
  return 'User';
});
UserSchema.virtual('displayId').get(function () {
  return "".concat(this.username, " - ").concat(this.role);
});
UserSchema.set('toObject', {
  virtuals: true
});
UserSchema.set('toJSON', {
  virtuals: true
});

var User = _mongoose.default.model('User', UserSchema);

var _default = User;
exports.default = _default;