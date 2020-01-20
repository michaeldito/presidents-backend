import logger from '../../../../config/logger';

export default function(handToBeat, cards) {
	logger('[Presidents@calculateSkips()]');
	logger(
		`[Presidents@calculateSkips()] handToBeat: ${JSON.stringify(handToBeat)}`,
	);
	logger(`[Presidents@calculateSkips()] cards: ${JSON.stringify(cards)}`);

	// first hand of the game there will be no handToBeat
	if (handToBeat.length === 0) {
		logger(`[Presidents@calculateSkips()] 0`);
		return 0;
	}
	// assume cards are valid and cards are better
	const handToBeatCardRankValue = handToBeat[0].cardRank.value;
	const cardRankValue = cards[0].cardRank.value;
	if (handToBeatCardRankValue === cardRankValue) {
		if (handToBeat.length === cards.length) {
			logger('[Presidents@calculateSkips()] 1');
			return 1;
		}
		const result = 1 + cards.length - handToBeat.length;
		logger(`[Presidents@calculateSkips()] ${result}`);
		return result;
	}
	logger(`[Presidents@calculateSkips()] 0`);
	return 0;
}
