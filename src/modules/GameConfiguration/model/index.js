import mongoose from 'mongoose';

import Card from '../../Card/model';

export const GameConfigurationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A name is required for every game configuration.'],
		trim: true,
		unique: true,
	},
	maxPlayers: {
		type: Number,
		required: [
			true,
			'A maxPlayers field is required for every game configuration.',
		],
		validate: {
			async validator(maxPlayers) {
				if (maxPlayers < this.minPlayers) return Promise.reject();
				return Promise.resolve();
			},
			message:
				'A value for maxPlayers must be greater than or equal to minPlayers.',
		},
	},
	minPlayers: {
		type: Number,
		required: [
			true,
			'A maxPlayers field is required for every game configuration.',
		],
		validate: {
			async validator(minPlayers) {
				if (minPlayers > this.maxPlayers) return Promise.reject();
				return Promise.resolve();
			},
			message:
				'A value for minPlayers must be less than or equal to maxPlayers.',
		},
	},
	deck: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Card',
		required: true, // mongoose will make empty array by default if required is true
		validate: {
			async validator(deck) {
				// deck must not be empty
				if (deck.length === 0) return Promise.reject(new Error('empty deck'));

				// deck must contain ObjectIds
				const areAllObjectIdsValid = deck.every(card =>
					mongoose.Types.ObjectId.isValid(card),
				);
				if (!areAllObjectIdsValid)
					return Promise.reject(new Error('bad objectId'));

				// deck must contain Cards
				const docs = await Card.find({ _id: { $in: deck } });
				if (docs.length !== deck.length)
					return Promise.reject(new Error('objectId does not reference a card'));

				// deck is valid
				return Promise.resolve();
			},
			message: 'A deck must be a non-empty array of Card ObjectIds.',
		},
		autopopulate: true,
	},
	numDecks: {
		type: Number,
		required: [
			true,
			'A numDecks field is required for every game configuration.',
		],
	},
});

GameConfigurationSchema.plugin(require('mongoose-unique-validator'));
GameConfigurationSchema.plugin(require('mongoose-autopopulate'));

GameConfigurationSchema.statics.findByName = function(name) {
	return this.findOne({ name });
};

GameConfigurationSchema.virtual('kind').get(function() {
	return 'GameConfiguration';
});

GameConfigurationSchema.virtual('displayId').get(function() {
	return this.name;
});
GameConfigurationSchema.set('toObject', { virtuals: true });
GameConfigurationSchema.set('toJSON', { virtuals: true });

const GameConfiguration = mongoose.model(
	'GameConfiguration',
	GameConfigurationSchema,
);

export default GameConfiguration;
