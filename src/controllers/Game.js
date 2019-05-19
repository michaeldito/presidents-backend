const { ranks, suites, create2DArray, shiftRight } = require('../utils');
const Game = require('../models/game');

class GameController {
  constructor() {}

  static async allGameNames(ctx) {
    try {
      let games = await Game.find({});
      games = games.map(game => game.name);
      ctx.status = 200;
      ctx.body = games;
    } catch (err) {
      ctx.status = 400;
      ctx.body = 'Failed to find games';
      ctx.body.err = err;
    }
  }

  // If game name is taken -> cannot create
  // else -> create default game and return it
  static async create(ctx) {
    try {
      const { name, createdBy } = ctx.request.body;

      let existingGame = await Game.findOne({ name });
      if (existingGame) {
        console.log('[Game:create] game with name already exists');
        ctx.status = 400;
        ctx.body = 'A game with that name already exists.';
        return
      }

      let game = new Game({
        name: name,
        status: 'NOT_STARTED',
        whoseTurnIdx: 0,
        handToBeat: [],
        players: [createdBy]
      });

      await game.save();
    
      ctx.status = 200;
      ctx.body = game;

    } catch (err) {
      ctx.status = 400;
      ctx.body = 'Failed to create a game';
      ctx.body.err = err;
    }
  }

  // if game status is NOT_STARTED -> player can join
  // if game has < MAX_PLAYERS -> player can join
  // if player already joined -> return the game
  // if player is able to join -> add player, return the game
  // if player unable to join -> return error

  // result: the player is added to the game if allowed
  // returns: the game or error msg
  static async joinGame({ username, gamename }) {
    console.log(`[controllers:Game:joinGame] (username:${username}, gamename:${gamename})`);

    try {
      const existingGame = await Game.findOne({name: gamename});
      const alreadyJoinedIdx = existingGame.players.find(player => player.username === username);
      const { status } = existingGame;
      const numPlayers = existingGame.players.length;

      if (alreadyJoinedIdx) {
        console.log('[controllers:Game:joinGame] Player already in the game')
        return {
          status: true,
          data: existingGame
        }
      } else if (status !== 'NOT_STARTED') {
        console.log('[controllers:Game:joinGame] Game has already started or finished.')
        return {
          status: false,
          error: 'Unable to join. Game has already started or finished.'
        }
      } else if (numPlayers >= 5) {
        console.log('[controllers:Game:joinGame] unable to join. max players reached');
        return {
          status: false,
          error: 'Unable to join. Max players reached.'
        }
      }
      else {
        await Game.updateOne({ name: gamename }, {
          $push: {
            'players': {
              username: username,
              hand: []
            }
          }
        })
      }
  
      const updatedGame = await Game.findOne({ name: gamename });
      console.log('[controllers:Game:joinGame] Able to join. Returning game');
      return {
        status: true,
        data: updatedGame
      }

    } catch (err) {
      console.log(`Failed to join a game: ${err}`);
    }
  }

  // shuffle(deck)
  // dealTo(players)
  // sort(cards) for display purposes
  // whoseTurnIdx = who has the 3 of clubs
  // set each players hand in the game
  // return {status: true, data:game}
  // error -> game already started, {status: false}
 
  static async startGame({ gamename }) {
    let deck = this.createDeck();
    let shuffledDeck = this.shuffle(deck);
    let playerHands = this.deal(numPlayers, shuffledDeck);
    let sortedPlayersHands = playerHands.map(hand => this.sortCards(hand));
    const whoseTurnIdx = this.find3Clubs(sortedPlayersHands);
    
    // before we set each players hand we can shift the values in the
    // playersHands array whoseTurnIdx number of times
    // [1, 2, 3, 4, 5] if 3 has 3 of clubs at index 2 -> [3, 4, 5, 1, 2]
    // const startHands = shiftRight(sortedPlayersHands, shiftAmount);
    // const whoseTurnIdx = 0;
    try {
      const existingGame = await Game.findOne({name: gamename});
    
      if (existingGame.status !== 'NOT_STARTED') {
        console.log('[controllers:Game:startGame] The game has already started')
        return {
          status: false,
          error: `The game ${gamename} has already started.`
        }
      }
      else {
        // todo: update the hands of each player in the game
        // since we shifted the array of players hands we
        await Game.updateOne({ name: gamename }, {

        })
      }
  
      const updatedGame = await Game.findOne({ name: gamename });
      console.log('[controllers:Game:startGame] Able to start. Returning game');
      return {
        status: true,
        data: updatedGame
      }

    } catch (err) {
      console.log(`Failed to start a game: ${err}`);
    }
  }

  createDeck() {
    let deck = [];
    for (let rank of ranks)
      for (let suite of suites)
        deck.push({rank, suite});
    return deck;
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  deal(numPlayers, shuffled) {
    let players = create2DArray(numPlayers);
    let i = 0;
    while (shuffled.length > 0) {
      players[i].push(shuffled.pop());
      i = (i + 1) % numPlayers;
    }
    return players;
  }

  intValue(card) {
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

  sortCards(cards) {
    return cards.sort((a, b) => (this.intValue(a.rank) > this.intValue(b.rank)) ? 1 : -1)
  }

  find3Clubs(allPlayerHands) {
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
  
  // todo: check if next player has finished
  nextPlayerIdx(prevPlayerIdx, skipCount, numPlayers) {
    if (skipCount) 
      return (prevPlayerIdx + skipCount + 1) % numPlayers;
    else 
      return (prevPlayerIdx + 1) % numPlayers;
  }
};

module.exports = GameController;
