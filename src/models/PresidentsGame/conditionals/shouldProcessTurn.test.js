const { GameStatus, GameConfiguration, User, Card } = require('../..');
const expect = require('expect');

module.exports = async () => describe.skip('#shouldProcessTurn()', async function() {   

  before(async function() {
    const status = await GameStatus.findByValue('FINALIZED');
    const config = await GameConfiguration.findOne({name: 'Presidents'});
    const currentPlayer = await User.findByUsername('tommypastrami');
    const user2 = await User.findByUsername('bella');
    const createdBy = currentPlayer;
    const user = currentPlayer;
    const name = 'should process turn prez game';
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
      user,
      joinedAt: new Date(),
      seatPosition: 0,
    };

    const player2 = {
      user: user2,
      joinedAt: new Date(),
      seatPosition: 0,
    };

    const handToBeat = await Card.findOne({shortHand: '4Clubs'});

    const game = {
      createdBy,
      name,
      status,
      config,
      rules,
      handToBeat,
      currentPlayer,
      rounds: [],
      players: [player1, player2]
    };
  
    await PresidentsGame.create(game);
  });


  describe('true', async function () {

    it('current hand has more cards', async function() {
      const doc = await PresidentsGame.findOne({name: 'should process turn prez game'});
      const threeHearts = await Card.findOne({shortHand: '4Hearts'});
      const threeSpades = await Card.findOne({shortHand: '4Spades'});
      //const skipsRemaining = await PresidentsGame.calculateSkips(turn.hand);
      const skipsRemaining = 0;
      const didCauseSkips = skipsRemaining > 0;
      const turn = {
        hand: [threeHearts, threeSpades],
        user: doc.currentPlayer,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips,
        skipsRemaining
      };
      let isTurnBetter;
      try {
        isTurnBetter = await PresidentsGame.isTurnBetter(turn);
      } catch (err) { }
      expect(isTurnBetter).toBeTruthy();
    });

    it('current hand has equal number of cards with same rank', async function() {  
      const doc = await PresidentsGame.findOne({name: 'should process turn prez game'});
      const threeHearts = await Card.findOne({shortHand: '4Hearts'});
      //const skipsRemaining = await PresidentsGame.calculateSkips(turn.hand);
      const skipsRemaining = 0;
      const didCauseSkips = skipsRemaining > 0;
      const turn = {
        hand: [threeHearts, threeSpades],
        user: doc.currentPlayer,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips,
        skipsRemaining
      };
      let isTurnBetter;
      try {
        isTurnBetter = await PresidentsGame.isTurnBetter(turn);
      } catch (err) { }
      expect(isTurnBetter).toBeTruthy();
    });

    it('current hand has equal number of cards with a better rank', async function() {  
      const doc = await PresidentsGame.findOne({name: 'should process turn prez game'});
      const card = await Card.findOne({shortHand: '5Hearts'});
      //const skipsRemaining = await PresidentsGame.calculateSkips(turn.hand);
      const skipsRemaining = 0;
      const didCauseSkips = skipsRemaining > 0;
      const turn = {
        hand: [card],
        user: doc.currentPlayer,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips,
        skipsRemaining
      };
      let isTurnBetter;
      try {
        isTurnBetter = await PresidentsGame.isTurnBetter(turn);
      } catch (err) { }
      expect(isTurnBetter).toBeTruthy();
    });

    it('current hand contains a two', async function() {  
      const doc = await PresidentsGame.findOne({name: 'should process turn prez game'});
      const card = await Card.findOne({shortHand: '2Hearts'});
      //const skipsRemaining = await PresidentsGame.calculateSkips(turn.hand);
      const skipsRemaining = 0;
      const didCauseSkips = skipsRemaining > 0;
      const turn = {
        hand: [card],
        user: doc.currentPlayer,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips,
        skipsRemaining
      };
      let isTurnBetter;
      try {
        isTurnBetter = await PresidentsGame.isTurnBetter(turn);
      } catch (err) { }
      expect(isTurnBetter).toBeTruthy();
    });

  });

  describe('false', async function () {

    it('current turn\'s rank does not beat previous turns rank', async function() {  
      const doc = await PresidentsGame.findOne({name: 'should process turn prez game'});
      const card = await Card.findOne({shortHand: '3Hearts'});
      //const skipsRemaining = await PresidentsGame.calculateSkips(turn.hand);
      const skipsRemaining = 0;
      const didCauseSkips = skipsRemaining > 0;
      const turn = {
        hand: [card],
        user: doc.currentPlayer,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips,
        skipsRemaining
      };
      let isTurnBetter;
      try {
        isTurnBetter = await PresidentsGame.isTurnBetter(turn);
      } catch (err) { }
      expect(isTurnBetter).toBeTruthy();
    });

    it('not enough cards selected (not a 2)', async function() {  
      const doc = await PresidentsGame.findOne({name: 'should process turn prez game'});
      //const skipsRemaining = await PresidentsGame.calculateSkips(turn.hand);
      const skipsRemaining = 0;
      const didCauseSkips = skipsRemaining > 0;
      const turn = {
        hand: [],
        user: doc.currentPlayer,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips,
        skipsRemaining
      };
      let isTurnBetter;
      try {
        isTurnBetter = await PresidentsGame.isTurnBetter(turn);
      } catch (err) { }
      expect(isTurnBetter).toBeTruthy();
    });


  });


});
