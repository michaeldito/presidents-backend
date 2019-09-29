const create2DArray = rows => {
  let A = [];
  for (let i = 0; i < rows; i++)
    A[i] = [];
  return A;
}

const shiftRight = (arr, amount) => {
  let shiftedArr = [...arr];
  for (let i of [...Array(amount).keys()]) {
    let first = shiftedArr.shift();
    shiftedArr.push(first);
  }
  return shiftedArr;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function deal(numPlayers, shuffled) {
  let dealtCards = create2DArray(numPlayers);
  let i = 0;
  while (shuffled.length > 0) {
    dealtCards[i].push(shuffled.pop());
    i = (i + 1) % numPlayers;
  }
  return dealtCards;
}


function sortCards(cards) {
  return cards.sort((a, b) => a.cardRank.value > b.cardRank.value ? 1 : -1);
}

function find3Clubs(allPlayerHands) {
  let p = 0, c = 0;
  for (let player of allPlayerHands) {
    for (let card of player) {
      if (card.shortHand === '3Clubs')
        return p;
      c++;
    }
    p += 1;
    c = 0;
  }

  // should never reach here
  throw new Error('3 of Clubs was not in the deck.');
}



function calculateSkips(handToBeat, cards) {
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
}

// the cards should all be of the same rank
// so check the first card's rank value against them all
// bad cards will pass the filter test
function areCardsOfSameRank(cards) {
  const rank = cards[0].cardRank.value;
  const badCards = cards.filter(card => card.cardRank.value !== rank);
  return badCards ? false : true
}

module.exports = {
  create2DArray,
  shiftRight,
  shuffle,
  deal,
  sortCards,
  find3Clubs,
  calculateSkips,
  areCardsOfSameRank
}