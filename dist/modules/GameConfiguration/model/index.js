"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GameConfigurationSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _model = _interopRequireDefault(require("../../Card/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var GameConfigurationSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for every game configuration.'],
    trim: true,
    unique: true
  },
  maxPlayers: {
    type: Number,
    required: [true, 'A maxPlayers field is required for every game configuration.'],
    validate: {
      validator(maxPlayers) {
        var _this = this;

        return _asyncToGenerator(function* () {
          if (maxPlayers < _this.minPlayers) return Promise.reject();
          return Promise.resolve();
        })();
      },

      message: 'A value for maxPlayers must be greater than or equal to minPlayers.'
    }
  },
  minPlayers: {
    type: Number,
    required: [true, 'A maxPlayers field is required for every game configuration.'],
    validate: {
      validator(minPlayers) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
          if (minPlayers > _this2.maxPlayers) return Promise.reject();
          return Promise.resolve();
        })();
      },

      message: 'A value for minPlayers must be less than or equal to maxPlayers.'
    }
  },
  deck: {
    type: [_mongoose.default.Schema.Types.ObjectId],
    ref: 'Card',
    required: true,
    // mongoose will make empty array by default if required is true
    validate: {
      validator(deck) {
        return _asyncToGenerator(function* () {
          // deck must not be empty
          if (deck.length === 0) return Promise.reject(new Error('empty deck')); // deck must contain ObjectIds

          var areAllObjectIdsValid = deck.every(card => _mongoose.default.Types.ObjectId.isValid(card));
          if (!areAllObjectIdsValid) return Promise.reject(new Error('bad objectId')); // deck must contain Cards

          var docs = yield _model.default.find({
            _id: {
              $in: deck
            }
          });
          if (docs.length !== deck.length) return Promise.reject(new Error('objectId does not reference a card')); // deck is valid

          return Promise.resolve();
        })();
      },

      message: 'A deck must be a non-empty array of Card ObjectIds.'
    },
    autopopulate: true
  },
  numDecks: {
    type: Number,
    required: [true, 'A numDecks field is required for every game configuration.']
  }
});
exports.GameConfigurationSchema = GameConfigurationSchema;
GameConfigurationSchema.plugin(require('mongoose-unique-validator'));
GameConfigurationSchema.plugin(require('mongoose-autopopulate'));

GameConfigurationSchema.statics.findByName = function (name) {
  return this.findOne({
    name
  });
};

GameConfigurationSchema.virtual('kind').get(function () {
  return 'GameConfiguration';
});
GameConfigurationSchema.virtual('displayId').get(function () {
  return this.name;
});
GameConfigurationSchema.set('toObject', {
  virtuals: true
});
GameConfigurationSchema.set('toJSON', {
  virtuals: true
});

var GameConfiguration = _mongoose.default.model('GameConfiguration', GameConfigurationSchema);

var _default = GameConfiguration;
exports.default = _default;