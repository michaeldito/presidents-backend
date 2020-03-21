"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  discriminatorKey: 'kind',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};
var GameSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: [true, 'A name is required to create a game.'],
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true, 'A createdAt is required to create a game.']
  },
  startedAt: {
    type: Date
  },
  finishedAt: {
    type: Date
  },
  status: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'GameStatus',
    required: [true, 'A status is required to create a game.'],
    autopopulate: true
  },
  config: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'GameConfiguration',
    required: [true, 'A config is required to create a game.'],
    autopopulate: true
  },
  createdBy: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A createdBy is required to create a game.'],
    autopopulate: true
  },
  currentPlayer: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User'
  }
}, options);
GameSchema.virtual('displayId').get(function () {
  var {
    name,
    kind
  } = this;
  return "".concat(kind, " - ").concat(name);
});

GameSchema.statics.findManyByIds = function (ids) {
  return this.find({
    _id: {
      $in: ids
    }
  });
};

GameSchema.plugin(require('mongoose-unique-validator'));
GameSchema.plugin(require('mongoose-autopopulate'));

var Game = _mongoose.default.model('Game', GameSchema);

var _default = Game;
exports.default = _default;