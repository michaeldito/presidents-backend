const { ranks, suites, create2DArray } = require('../utils');

class Game {
  static create(name, createdBy) {
    const game = {
      game: {
        gameName: name,
        status: 'NOT_STARTED',
        players: [createdBy],
        handToBeat: [],
        players: [
          {
            username: createdBy,
            hand: []
          }
        ]
      }
    }

    return game
  }

  static startGame() {
    let deck = this.createDeck();
    let shuffledDeck = this.shuffle(deck);
    let playerHands = this.deal(numPlayers, shuffledDeck);
    playersHands = playerHands.map(hand => this.sortCards(hand));
  }

  createDeck = () => {
    let deck = [];
    for (let rank of ranks)
      for (let suite of suites)
        deck.push({rank, suite});
    return deck;
  }

  shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  deal = (numPlayers, shuffled) => {
    let players = create2DArray(numPlayers);
    let i = 0;
    while (shuffled.length > 0) {
      players[i].push(shuffled.pop());
      i = (i + 1) % numPlayers;
    }
    return players;
  }

  intValue = card => {
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

  sortCards = (cards) => 
    cards.sort((a, b) => (this.intValue(a.rank) > this.intValue(b.rank)) ? 1 : -1)

  find3Clubs = allPlayerHands => {
    let i = 0
    for (let player of allPlayerHands) {
      for (let card of player) {
        if (card.rank === '3' && card.suite === 'C')
          return i;
      }
      i += 1;
    }

    // should never reach here
    return 0;
  }
  
  static nextPlayerIdx = (gameStatus, prevPlayerIdx, skipCount, numPlayers, allPlayerHands) => {
    if (gameStatus === 'NOT_STARTED')
      return this.find3Clubs(allPlayerHands);
    if (skipCount) 
      return (prevPlayerIdx + skipCount + 1) % numPlayers;
    else 
      return (prevPlayerIdx + 1) % numPlayers;
  }
};