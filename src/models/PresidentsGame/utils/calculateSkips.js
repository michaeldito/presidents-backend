module.exports = function(handToBeat, cards) {
	console.log('[PresidentsGame@calculateSkips()]');

	// first hand of the game there will be no handToBeat
	if (handToBeat.length === 0) {
		console.log(`[PresidentsGame@calculateSkips()] 0`);
		return 0;
	}
	// assume cards are valid and cards are better
	const handToBeatCardRankValue = handToBeat[0].cardRank.value;
	const cardRankValue = cards[0].cardRank.value;
	if (handToBeatCardRankValue === cardRankValue) {
		if (handToBeat.length === cards.length) {
			console.log('[PresidentsGame@calculateSkips()] 1');
			return 1;
		}
		else {
			let result = 1 + cards.length - handToBeat.length;
			console.log(`[PresidentsGame@calculateSkips()] ${result}`);
			return result;
		}
	}
	console.log(`[PresidentsGame@calculateSkips()] 0`);
	return 0;
};