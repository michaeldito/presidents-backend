const { PresidentsGame, GameConfiguration, User, Card, GameStatus, PoliticalRank } = require('../../') ;
const expect = require('expect');

module.exports = async () => describe('#processTurn()', async function() {   

  before(async function() {
    const status = await GameStatus.findByValue('NOT_STARTED');
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
      hand: []
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
      players: [player1,player2, player3]
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
      const lastPlayer = doc.players.find(player => player.user.toString() === this.user2._id.toString())
      expect(lastPlayer.nextGameRank.name).toBe('President');
    });

    it('if only 1 other player has cards it finalizes the game and sets asshole', async function() {  
      const doc = await PresidentsGame.findOne({name: 'process turn prez game'});
      expect(doc.status.value).toBe('FINALIZED');
      const lastPlacePlayer = doc.players.find(player => player.user.toString() === this.user1._id.toString());
      expect(lastPlacePlayer.nextGameRank.name).toBe('Asshole');
    });

  });
  

});
