export default function(cards) {
	console.log('[Presidents@areCardsValid()]');

	// is the current hand valid (all ranks the same)?
	const currentHandCardRankValues = cards.map(card => card.cardRank.value);
	const rankValue = currentHandCardRankValues[0];
	const areCardsValid = currentHandCardRankValues.every(
		cardRankValue => cardRankValue === rankValue,
	);

	const result = !!areCardsValid;
	console.log(`[Presidents@areCardsValid()] ${result}`);

	return result;
}
