import logger from '../../../../config/logger';

export default function(cards) {
	logger('[Presidents@areCardsValid()]');

	// is the current hand valid (all ranks the same)?
	const currentHandCardRankValues = cards.map(card => card.cardRank.value);
	const rankValue = currentHandCardRankValues[0];
	const areCardsValid = currentHandCardRankValues.every(
		cardRankValue => cardRankValue === rankValue,
	);

	const result = !!areCardsValid;
	logger(`[Presidents@areCardsValid()] ${result}`);

	return result;
}
