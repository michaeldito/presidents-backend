import logger from '../config/logger';

export const create2DArray = rows => {
	const A = [];
	for (let i = 0; i < rows; i++) A[i] = [];
	return A;
};



export const shuffle = arr => {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
};

export const deal = (numPlayers, shuffled) => {
	const dealtCards = create2DArray(numPlayers);
	let i = 0;
	while (shuffled.length > 0) {
		dealtCards[i].push(shuffled.pop());
		i = (i + 1) % numPlayers;
	}
	return dealtCards;
};

export const sortCards = cards => {
	return cards.sort((a, b) => (a.cardRank.value > b.cardRank.value ? 1 : -1));
};

export const find3Clubs = allPlayerHands => {
	let p = 0;
	for (const player of allPlayerHands) {
		for (const card of player) {
			if (card.shortHand === '3Clubs') {
				return p;
			}
		}
		p += 1;
	}

	// should never reach here
	throw new Error('3 of Clubs was not in the deck.');
};

export const areCardsValid = cards => {
	logger('[PresidentsGame@areCardsValid()]');

	// is the current hand valid (all ranks the same)?
	const currentHandCardRankValues = cards.map(card => card.cardRank.value);
	const rankValue = currentHandCardRankValues[0];
	const areCardsValid = currentHandCardRankValues.every(
		cardRankValue => cardRankValue === rankValue,
	);

	const result = !!areCardsValid;
	logger(`[PresidentsGame@areCardsValid()] ${result}`);

	return result;
};

export const calculateSkips = (handToBeat, cards) => {
	const handToBeatCardRankValue = handToBeat[0].cardRank.value;
	const cardRankValue = cards[0].cardRank.value;
	if (handToBeatCardRankValue === cardRankValue) {
		if (handToBeat.length === cards.length) {
			return 1;
		}
		return 1 + cards.length - handToBeat.length;
	}
	return 0;
};

// the cards should all be of the same rank
// so check the first card's rank value against them all
// bad cards will pass the filter test
export const areCardsOfSameRank = cards => {
	const rank = cards[0].cardRank.value;
	const badCards = cards.filter(card => card.cardRank.value !== rank);
	return !badCards;
};

export const areCardsBetter = async (handToBeat, cards) => {
	logger('[PresidentsGame@areCardsBetter()]');
	logger(`[PresidentsGame@areCardsBetter()] handToBeat: ${handToBeat}`);
	logger(`[PresidentsGame@areCardsBetter()] cards: ${cards}`);

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
};

export const pick = (obj, feilds) => {
	const newObj = {};
	feilds.forEach(feild => {
		newObj[feild] = obj[feild];
	});
	return newObj;
};

const Utils = {
	create2DArray,
	shuffle,
	deal,
	sortCards,
	find3Clubs,
	calculateSkips,
	areCardsOfSameRank,
	areCardsValid,
	areCardsBetter,
	pick,
};

export default Utils;