import mongoose from 'mongoose';

import Status from '../../Status/model';

const GameStatusSchema = new mongoose.Schema({});

const GameStatus = Status.discriminator('GameStatus', GameStatusSchema);

export default GameStatus;
