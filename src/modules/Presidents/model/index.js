import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

import Game from '../../Game/model';
import areCardsBetter from './conditionals/areCardsBetter';
// conditionals
import areCardsValid from './conditionals/areCardsValid';
import didCurrentPlayersLastTurnEndTheRound from './conditionals/didCurrentPlayersLastTurnEndTheRound';
import shouldProcessTurn from './conditionals/shouldProcessTurn';
// queries
import getNextPlayer from './queries/getNextPlayer';
import PlayerSchema from './schemas/Player';
import RoundSchema from './schemas/Round';
import RulesSchema from './schemas/Rules';
import TurnSchema from './schemas/Turn';
import drinkDrink from './updates/drinkDrink';
import giveDrink from './updates/giveDrink';
import initialize from './updates/initialize';
import initializeNextRound from './updates/initializeNextRound';
// updates
import join from './updates/join';
import processTurn from './updates/processTurn';
// utils
import calculateSkips from './utils/calculateSkips';


const PresidentsSchema = new mongoose.Schema({
	winner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	turnToBeat: {
		type: TurnSchema,
	},
	rules: {
		type: RulesSchema,
		required: [
			true,
			'A value for rules is required to create a Presidents game.',
		],
	},
	rounds: {
		type: [RoundSchema],
		required: true,
	},
	players: {
		type: [PlayerSchema],
		required: true,
	},
	drinks: [],
});

// conditionals
PresidentsSchema.statics.areCardsValid = areCardsValid;
PresidentsSchema.statics.areCardsBetter = areCardsBetter;
PresidentsSchema.methods.shouldProcessTurn = shouldProcessTurn;
PresidentsSchema.methods.didCurrentPlayersLastTurnEndTheRound = didCurrentPlayersLastTurnEndTheRound;

// queries
PresidentsSchema.methods.getNextPlayer = getNextPlayer;

// updates
PresidentsSchema.methods.join = join;
PresidentsSchema.methods.initialize = initialize;
PresidentsSchema.methods.initializeNextRound = initializeNextRound;
PresidentsSchema.methods.processTurn = processTurn;
PresidentsSchema.methods.drinkDrink = drinkDrink;
PresidentsSchema.methods.giveDrink = giveDrink;

// utils
PresidentsSchema.statics.calculateSkips = calculateSkips;

// plugins
PresidentsSchema.plugin(autopopulate);

const Presidents = Game.discriminator('Presidents', PresidentsSchema);

export default Presidents;
