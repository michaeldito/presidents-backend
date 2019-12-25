const { 
  GameStatus,
  Presidents,
  GameConfiguration,
  User,
  Card,
  PoliticalRank
} = require('../..');
const expect = require('expect');


module.exports = async () => describe('#drinkDrink()', async function() {   
  
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
    const name = 'drinkDrink prez game';

    const jackHearts = await Card.findOne({shortHand: 'JHearts'});
    const aceSpades = await Card.findOne({shortHand: 'ASpades'});
    const aceHearts = await Card.findOne({shortHand: 'AHearts'});
    const jackDiamonds = await Card.findOne({shortHand: 'JDiamonds'});
    const jackClubs = await Card.findOne({shortHand: 'JClubs'});
    const threeClubs = await Card.findOne({shortHand: '3Clubs'});
    const fourClubs = await Card.findOne({shortHand: '4Clubs'});
    const fourDiamonds = await Card.findOne({shortHand: '4Diamonds'});

    this.jackHearts = jackHearts;
    this.jackDiamonds = jackDiamonds;
    this.jackClubs = jackClubs;
    this.aceSpades = aceSpades;
    this.threeClubs = threeClubs;
    this.fourClubs = fourClubs;
    this.fourDiamonds = fourDiamonds;
    this.aceHearts = aceHearts;

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
      hand: [threeClubs, fourClubs],
      drinksReceived: [],
      drinksDrunk: 0
    };

    const player2 = {
      user: user2,
      joinedAt: new Date(),
      seatPosition: 1,
      hand: [fourDiamonds, jackDiamonds, jackClubs],
      drinksReceived: [ {
        sentBy: user1
      }],
      drinksDrunk: 0
    };

    const player3 = {
      user: user3,
      joinedAt: new Date(),
      seatPosition: 2,
      hand: [aceSpades, aceHearts],
      drinksReceived: [],
      drinksDrunk: 0
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
        turns: [{
          user: this.user2,
          cardsPlayed: [jackHearts],
          wasPassed: false,
          wasSkipped: false,
          didCauseSkips: true,
          skipsRemaining: 0,
          endedRound: false
        },
        {
          user: this.user3,
          cardsPlayed: [],
          wasPassed: false,
          wasSkipped: true,
          didCauseSkips: false,
          skipsRemaining: 0,
          endedRound: false
        },
        {
          user: this.user1,
          cardsPlayed: [],
          wasPassed: true,
          wasSkipped: false,
          didCauseSkips: false,
          skipsRemaining: 0,
          endedRound: false
        }]
      }],
      players: [player1, player2, player3]
    };
  
    await Presidents.create(game);
  });

  describe('validations', async function () {

    it('player must have a drink to drink', async function() {  
      let doc = await Presidents.findOne({name: 'drinkDrink prez game'});
      const message = 'Unable to drink any drinks. User has none to drink.';
      try {
        await doc.drinkDrink(doc.currentPlayer);
      } catch(err) {
        expect(err.message).toBe(message);
      }
    });

  });

  describe('successful', async function () {

    it('players drinksDrunk count has increased', async function() {  
      let doc = await Presidents.findOne({name: 'drinkDrink prez game'});
      try {
        await doc.drinkDrink(this.user2);
      } catch(err) { }

      const player2 = doc.players.find(player => player.user.toString() === this.user2._id.toString());
      expect(player2.drinksDrunk).toBe(1);
    });

  });

});
