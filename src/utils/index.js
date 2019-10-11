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

function areCardsValid(cards) {
  console.log('[PresidentsGame@areCardsValid()]');

  // is the current hand valid (all ranks the same)?
  const currentHandCardRankValues = cards.map(card => card.cardRank.value)
  const rankValue = currentHandCardRankValues[0];
  const areCardsValid = currentHandCardRankValues.every(cardRankValue => cardRankValue === rankValue);

  let result = areCardsValid ? true : false;
  console.log(`[PresidentsGame@areCardsValid()] ${result}`);

  return result;
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

async function areCardsBetter(handToBeat, cards) {
  console.log('[PresidentsGame@areCardsBetter()]');
  console.log(`[PresidentsGame@areCardsBetter()] handToBeat: ${handToBeat}`)
  console.log(`[PresidentsGame@areCardsBetter()] cards: ${cards}`)

  const handToBeatCardRankValues = handToBeat.map(card => card.cardRank.value);
  const currentHandCardRankValues = cards.map(card => card.cardRank.value);

  // case 3: current hand has fewer cards than previous hand
  // case 3a: if it contains a 2 it's a valid turn
  const doesContainTwo = !! currentHandCardRankValues.find(value => value === 2);
  console.log(`[PresidentsGame@areCardsBetter()] doesContainTwo: ${doesContainTwo}`)
  if (doesContainTwo) {
    return Promise.resolve(true);
  }
  
  // case 1: current hand has more cards
  const doesCurrentHandHaveMoreCards = currentHandCardRankValues.length > handToBeatCardRankValues.length;
  console.log(`[PresidentsGame@areCardsBetter()] doesCurrentHandHaveMoreCards: ${doesCurrentHandHaveMoreCards}`)
  if (doesCurrentHandHaveMoreCards) {
    return Promise.resolve(true);
  }

  // case 2: current and previous hand have equal number of cards
  const areNumberOfCardsEqual = currentHandCardRankValues.length === handToBeatCardRankValues.length;
  console.log(`[PresidentsGame@areCardsBetter()] areNumberOfCardsEqual: ${areNumberOfCardsEqual}`)
  if (areNumberOfCardsEqual) {

    // case2a: cards are of same rank
    const areCardsSameRank = currentHandCardRankValues[0] === handToBeatCardRankValues[0];
    console.log(`[PresidentsGame@areCardsBetter()] areCardsSameRank: ${areCardsSameRank}`)
    if (areCardsSameRank) {
      return Promise.resolve(true);
    }

    // case2b: current hand's card rank beats previous turns card rank
    const doesCurrentHandRankBeatPrevious = currentHandCardRankValues[0] > handToBeatCardRankValues[0];
    console.log(`[PresidentsGame@areCardsBetter()] doesCurrentHandRankBeatPrevious: ${doesCurrentHandRankBeatPrevious}`)
    if (doesCurrentHandRankBeatPrevious) {
      return Promise.resolve(true);
    }

    // case2c: current turn's rank does not beat previous turns rank
    else { 
      return Promise.reject(new Error(`The rank of the selected cards does not beat the previous turns.`));
    }
  }

  // case 3b: if it does not contain a 2
  return Promise.reject(new Error(`The selected cards contain fewer cards than the previous turn, and does not contain a two.`));
}

module.exports = {
  create2DArray,
  shiftRight,
  shuffle,
  deal,
  sortCards,
  find3Clubs,
  calculateSkips,
  areCardsOfSameRank,
  areCardsValid,
  areCardsBetter
}