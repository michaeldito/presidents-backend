import mongoose from 'mongoose';

const PoliticalRankSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A name is required to create a political rank.'],
		unique: true,
	},
	value: {
		type: Number,
		required: [true, 'A value is required to create a political rank.'],
		unique: true,
	},
});

PoliticalRankSchema.statics.findByName = function(name) {
	return this.findOne({ name });
};

PoliticalRankSchema.statics.findByValue = function(value) {
	return this.findOne({ value });
};

PoliticalRankSchema.statics.getRanks = function(howMany) {
	return this.find({ value: { $gt: 0, $lt: howMany + 1 } });
};

PoliticalRankSchema.plugin(require('mongoose-unique-validator'));

PoliticalRankSchema.virtual('kind').get(function() {
	return 'PoliticalRank';
});
PoliticalRankSchema.virtual('displayId').get(function() {
	const { name, value } = this;
	return `${name} - ${value}`;
});
PoliticalRankSchema.set('toObject', { virtuals: true });
PoliticalRankSchema.set('toJSON', { virtuals: true });

const PoliticalRank = mongoose.model('PoliticalRank', PoliticalRankSchema);

export default PoliticalRank;
