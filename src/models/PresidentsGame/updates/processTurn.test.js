const { PresidentsGame, GameConfiguration, User, Card, GameStatus, PoliticalRank } = require('../../') ;
const expect = require('expect');

module.exports = async () => describe('#processTurn()', async function() {   

  before(async function() {
    const status = await GameStatus.findByValue('IN_PROGRESS');
    const config = await GameConfiguration.findOne({name: 'Presidents'});

    this.user1 = await User.findByUsername('tommypastrami');
    this.user2 = await User.findByUsername('bella');
    this.user3 = await User.findByUsername('tony');

    const user1 = this.user1._id;
    const user2 = this.user2._id;
    const user3 = this.user3._id;

    const currentPlayer = user2;
    const createdBy = currentPlayer;
    const name = 'process turn prez game';

    const jackHearts = await Card.findOne({shortHand: 'JHearts'});
    const aceSpades = await Card.findOne({shortHand: 'ASpades'});
    const jackDiamonds = await Card.findOne({shortHand: 'JDiamonds'});
    const jackClubs = await Card.findOne({shortHand: 'JClubs'});
    const twoClubs = await Card.findOne({shortHand: '2Clubs'});

    this.jackHearts = jackHearts;
    this.aceSpades = aceSpades;
    this.jackDiamonds = jackDiamonds;
    this.jackClubs = jackClubs;
    this.twoClubs = twoClubs;

    const rules = {
      doubleSkips: false,
      scumStarts: false,
      scumHandsTwo: false,
      oneEyedJacksAndKingOfHearts: false,
      reversePresidentScumTrade: false,
      presidentDeals: false,
      goLow: false,
      equalNumber: false,
      noEndOnBomb: false,
      tripleSixes: false,
      passOut: false,
      fourInARow: false,
      larryPresidents: true
    };

    const player1 = {
      user: user1,
      joinedAt: new Date(),
      seatPosition: 0,
      hand: [jackClubs]
    };

    const player2 = {
      user: user2,
      joinedAt: new Date(),
      seatPosition: 1,
      hand: [aceSpades]
    };

    const player3 = {
      user: user3,
      joinedAt: new Date(),
      seatPosition: 2,
      hand: [twoClubs]
    };

    const game = {
      createdBy,
      name,
      status,
      config,
      rules,
      currentPlayer,
      handToBeat: [jackHearts],
      rounds: [{
        turns: []
      }],
      players: [player1, player2, player3]
    };
  
    await PresidentsGame.create(game);
  });

  describe('successful', async function () {
  
    it('adds a turn to last round', async function() {  
      const doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      const aceSpades = await Card.findOne({shortHand: 'ASpades'});

      const turn = {
        user: this.user2._id,
        cardsPlayed: [aceSpades],
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: false,
        endedRound: false
      }
      await doc.processTurn(turn);
      expect(doc.rounds[0].turns.length).toBe(1);
    });
    
    it('if turn contained cards they are removed from players hand', async function() {  
      const doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      const lastPlayer = doc.players.find(player => player.user.toString() === this.user2._id.toString())
      expect(lastPlayer.hand.length).toBe(0);
    });
  
    it('should set next player correctly', async function() {  
      const doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      expect(doc.currentPlayer.toString()).toBe(this.user3._id.toString());
    });

    it('if player has no more cards then it should assign rank for next round', async function() {  
      const doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      const firstPlayerDone = doc.players.find(player => player.user.toString() === this.user2._id.toString())
      expect(firstPlayerDone.nextGameRank.name).toBe('President');
    });

    it('if player plays a 2 it ends the round', async function() {  
      let doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      const roundLengthBeforeTurn = doc.rounds.length;
      const turn = {
        user: this.user3._id,
        cardsPlayed: [this.twoClubs],
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: false,
        endedRound: true
      }
      await doc.processTurn(turn);
      doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      const roundLengthAfterTurn = doc.rounds.length;
      expect(roundLengthAfterTurn).toBe(roundLengthBeforeTurn + 1);
    });

    it('if only 1 other player has cards it finalizes the game and sets asshole', async function() {  
      const doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      expect(doc.status.value).toBe('FINALIZED');
      const lastPlacePlayer = doc.players.find(player => player.user.toString() === this.user1._id.toString());
      expect(lastPlacePlayer.nextGameRank.name).toBe('Asshole');
    });

  });
  
  describe.skip('skips successful', async function () {
  
    before(async function() {
      // create a new game with 2 players
      // give 1 player []
      // give 1 player []
    });
    it('1 skip', async function() {  
      // given current handToBeat is a 3
      // when next player plays a 3
      // then game.turns should contain a skip turn
      // expect the skip turn to be for other player
      // then game.currentPlayer should be the same player
    });

    it('2 skip', async function() {  
      // given current handToBeat is a 3
      // when next player plays two 3's
      // then game.turns should contain two skip turns
      // then game.currentPlayer should be the other player
      // expect the 1 skip to be for player1 and 1 for player2
    });

    it('3 skip', async function() {  
      // given current handToBeat is a 3
      // when next player plays three 3's
      // then game.turns should contain three skip turns
      // then game.currentPlayer should be the other player
      // expect 2 skips for player2 and 1 skip for player1
    });

  });

  describe('players last turn ended the round', async function() {  
    
    it('true', async function() {  

    });

    it('false', async function() {  

    });
    
  });
  
});
