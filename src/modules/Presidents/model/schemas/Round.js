import mongoose from 'mongoose';

import TurnSchema from './Turn';

const options = {
	toObject: { virtuals: true },
	toJSON: { virtuals: true },
};
const RoundSchema = new mongoose.Schema(
	{
		startedAt: {
			type: Date,
			default: Date.now,
		},
		turns: {
			type: [TurnSchema],
		},
	},
	options,
);

RoundSchema.virtual('displayId').get(function() {
	const { startedAt, turns, _id } = this;
	return `${startedAt} - ${turns.length} turns - ${_id} `;
});

export default RoundSchema;
