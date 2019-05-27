
const ranks = ['2','3' ,'4' ,'5' ,'6' ,'7' ,'8' ,'9' ,'10' ,'J', 'Q', 'K', 'A'];
const suites = ['H', 'D', 'S', 'C'];

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


function createDeck() {
  let deck = [];
  for (let rank of ranks)
    for (let suite of suites)
      deck.push({rank, suite});
  return deck;
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
  let players = create2DArray(numPlayers);
  let i = 0;
  while (shuffled.length > 0) {
    players[i].push(shuffled.pop());
    i = (i + 1) % numPlayers;
  }
  return players;
}

function intValue(card) {
  switch (card) {
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case '10': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    case 'A': return 14;
    case '2': return 15;
    default: return 0;
  }
}

function sortCards(cards) {
  return cards.sort((a, b) => a.cardRank.value > b.cardRank.value ? 1 : -1);
}

function find3Clubs(allPlayerHands) {
let p = 0, c = 0;
  for (let player of allPlayerHands) {
    for (let card of player) {
      if (card.shortHand === '3Clubs')
        return {p, c};
      c++;
    }
    p += 1;
    c = 0;
  }

  // should never reach here
  throw new Error('3 of Clubs was not in the deck.');
}

module.exports = {
  ranks,
  suites,
  create2DArray,
  shiftRight,
  createDeck,
  shuffle,
  deal,
  intValue,
  sortCards,
  find3Clubs
}