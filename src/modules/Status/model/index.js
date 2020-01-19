import mongoose from 'mongoose';

const options = {
	discriminatorKey: 'kind',
	toObject: { virtuals: true },
	toJSON: { virtuals: true },
};

const StatusSchema = new mongoose.Schema(
	{
		value: {
			type: String,
			required: [true, 'A Status must have a value to be created.'],
			trim: true,
			unique: [true, 'A Status must have a unique value to be created'],
		},
	},
	options,
);

StatusSchema.statics.findByValue = function(value) {
	return this.findOne({ value });
};

StatusSchema.virtual('displayId').get(function() {
	const { value, kind } = this;
	return `${kind} - ${value}`;
});

StatusSchema.plugin(require('mongoose-unique-validator'));

const Status = mongoose.model('Status', StatusSchema);

export default Status;
