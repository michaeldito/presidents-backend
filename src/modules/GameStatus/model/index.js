const mongoose = require('mongoose');
const Status = require('../../Status/model');

const GameStatusSchema = new mongoose.Schema({});

const GameStatus = Status.discriminator('GameStatus', GameStatusSchema);

module.exports = GameStatus;