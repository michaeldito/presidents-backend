import logger from '../../../../config/logger';

export default async function(handToBeat, cards) {
	logger('[PresidentsGame@areCardsBetter()]');
	const toBeat = handToBeat.map(c => {
		c.shortHand;
	});
	const c = cards.map(c => {
		c.shortHand;
	});
	logger(`[PresidentsGame@areCardsBetter()] handToBeat: ${toBeat}`);
	logger(`[PresidentsGame@areCardsBetter()] cards: ${c}`);

	const handToBeatCardRankValues = handToBeat.map(card => card.cardRank.value);
	const currentHandCardRankValues = cards.map(card => card.cardRank.value);

	// case 3: current hand has fewer cards than previous hand
	// case 3a: if it contains a 2 it's a valid turn
	const doesContainTwo = !!currentHandCardRankValues.find(value => value === 2);
	logger(
		`[PresidentsGame@areCardsBetter()] doesContainTwo: ${doesContainTwo}`,
	);
	if (doesContainTwo) {
		return Promise.resolve(true);
	}

	// case 1: current hand has more cards
	const doesCurrentHandHaveMoreCards =
		currentHandCardRankValues.length > handToBeatCardRankValues.length;
	logger(
		`[PresidentsGame@areCardsBetter()] doesCurrentHandHaveMoreCards: ${doesCurrentHandHaveMoreCards}`,
	);
	if (doesCurrentHandHaveMoreCards) {
		return Promise.resolve(true);
	}

	// case 2: current and previous hand have equal number of cards
	const areNumberOfCardsEqual =
		currentHandCardRankValues.length === handToBeatCardRankValues.length;
	logger(
		`[PresidentsGame@areCardsBetter()] areNumberOfCardsEqual: ${areNumberOfCardsEqual}`,
	);
	if (areNumberOfCardsEqual) {
		// case2a: cards are of same rank
		const areCardsSameRank =
			currentHandCardRankValues[0] === handToBeatCardRankValues[0];
		logger(
			`[PresidentsGame@areCardsBetter()] areCardsSameRank: ${areCardsSameRank}`,
		);
		if (areCardsSameRank) {
			return Promise.resolve(true);
		}

		// case2b: current hand's card rank beats previous turns card rank
		const doesCurrentHandRankBeatPrevious =
			currentHandCardRankValues[0] > handToBeatCardRankValues[0];
		logger(
			`[PresidentsGame@areCardsBetter()] doesCurrentHandRankBeatPrevious: ${doesCurrentHandRankBeatPrevious}`,
		);
		if (doesCurrentHandRankBeatPrevious) {
			return Promise.resolve(true);
		}

		// case2c: current turn's rank does not beat previous turns rank

		return Promise.reject(
			new Error(
				`The rank of the selected cards does not beat the previous turns.`,
			),
		);
	}

	// case 3b: if it does not contain a 2
	return Promise.reject(
		new Error(
			`The selected cards contain fewer cards than the previous turn, and does not contain a two.`,
		),
	);
}
