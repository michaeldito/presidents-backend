export default function(handToBeat, cards) {
	console.log('[Presidents@calculateSkips()]');
	console.log(
		`[Presidents@calculateSkips()] handToBeat: ${JSON.stringify(handToBeat)}`,
	);
	console.log(`[Presidents@calculateSkips()] cards: ${JSON.stringify(cards)}`);

	// first hand of the game there will be no handToBeat
	if (handToBeat.length === 0) {
		console.log(`[Presidents@calculateSkips()] 0`);
		return 0;
	}
	// assume cards are valid and cards are better
	const handToBeatCardRankValue = handToBeat[0].cardRank.value;
	const cardRankValue = cards[0].cardRank.value;
	if (handToBeatCardRankValue === cardRankValue) {
		if (handToBeat.length === cards.length) {
			console.log('[Presidents@calculateSkips()] 1');
			return 1;
		}
		const result = 1 + cards.length - handToBeat.length;
		console.log(`[Presidents@calculateSkips()] ${result}`);
		return result;
	}
	console.log(`[Presidents@calculateSkips()] 0`);
	return 0;
}
