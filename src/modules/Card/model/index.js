import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import unique from 'mongoose-unique-validator';

const CardSchema = new mongoose.Schema({
	shortHand: {
		type: String,
		required: [true, 'A shorthand is required for every card.'],
		unique: true,
	},
	cardRank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'CardRank',
		required: [true, 'A card rank is required for every card.'],
		autopopulate: true,
	},
	suit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Suit',
		required: [true, 'A suit is required for every card.'],
		autopopulate: true,
	},
});

CardSchema.statics.getDeck = function() {
	return this.find({});
};

CardSchema.statics.findManyByIds = function(ids) {
	return this.find({ _id: { $in: ids } });
};
CardSchema.virtual('kind').get(function() {
	return 'Card';
});

CardSchema.virtual('displayId').get(function() {
	const rankName = this.cardRank.name;
	const suitName = this.suit.name;
	const { character } = this.suit;
	const { color } = this.suit;
	return `${rankName} - ${suitName} - ${character} - ${color}`;
});

CardSchema.set('toObject', { virtuals: true });
CardSchema.set('toJSON', { virtuals: true });
CardSchema.plugin(autopopulate);
CardSchema.plugin(unique);

const Card = mongoose.model('Card', CardSchema);

export default Card;
