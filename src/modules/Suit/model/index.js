import mongoose from 'mongoose';
import unique from 'mongoose-unique-validator';

const SuitSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A name is required for every suit.'],
		unique: true,
	},
	color: {
		type: String,
		required: [true, 'A color is required for every suit.'],
	},
	character: {
		type: String,
		required: [true, 'A character is required for every suit.'],
		unique: true,
	},
	value: {
		type: Number,
		required: [true, 'A value is required for every suit.'],
		unique: true,
	},
});

SuitSchema.statics.findAll = function() {
	return this.find({});
};

SuitSchema.statics.findByName = function(name) {
	return this.findOne({ name });
};

SuitSchema.plugin(unique);

SuitSchema.virtual('kind').get(function() {
	return 'Suit';
});
SuitSchema.virtual('displayId').get(function() {
	const { name, color, character } = this;
	return `${name} - ${character} - ${color}`;
});

SuitSchema.set('toObject', { virtuals: true });
SuitSchema.set('toJSON', { virtuals: true });

const Suit = mongoose.model('Suit', SuitSchema);

export default Suit;
