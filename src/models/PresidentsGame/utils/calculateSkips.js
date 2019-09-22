

module.exports = function(handToBeat, cards) {
	// assume cards are valid and cards are better
	const handToBeatCardRankValue = handToBeat[0].cardRank.value;
	const cardRankValue = cards[0].cardRank.value;
	if (handToBeatCardRankValue === cardRankValue) {
		if (handToBeat.length === cards.length) {
			return 1;
		}
		else {
			return 1 + cards.length - handToBeat.length;
		}
	}
	return 0;
};