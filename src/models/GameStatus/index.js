const mongoose = require('mongoose');
const Status = require('../Status');

const GameStatus = Status.discriminator('GameStatus', new mongoose.Schema({}));

module.exports = GameStatus;