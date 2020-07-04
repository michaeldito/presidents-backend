const Presidents = require('../');
const Card = require('../../../Card/model');
const GameStatus = require('../../../GameStatus/model');
const User = require('../../../User/model');
const GameConfiguration = require('../../../GameConfiguration/model');
const mongoose = require('mongoose');
const expect = require('expect');

module.exports = async () => describe('#shouldProcessTurn()', async function() {   

  describe('true', async function () {

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
      const name = 'shd process turn test game';
  
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
        drinksDrunk: 0,
        drinksReceived: [],
        drinksSent: []
      };
  
      const player2 = {
        user: user2,
        joinedAt: new Date(),
        seatPosition: 1,
        hand: [fourDiamonds, jackDiamonds, jackClubs],
        drinksDrunk: 0,
        drinksReceived: [],
        drinksSent: []
      };
  
      const player3 = {
        user: user3,
        joinedAt: new Date(),
        seatPosition: 2,
        hand: [aceSpades, aceHearts],
        drinksDrunk: 0,
        drinksReceived: [],
        drinksSent: []
      };
  
      const game = {
        createdBy,
        name,
        status,
        config,
        rules,
        currentPlayer,
        turnToBeat: {
          user: user1,
          cardsplayed:[jackHearts],
          wasPassed:false,
          wasSkipped:false,
          didCauseSkips:false,
          skipsRemaining:0,
          endedRound:false
        },
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

    it('current hand is better', async function() {
      let doc = await Presidents.findOne({name: 'shd process turn test game'});
      const sevenHearts = await Card.find({shortHand: '7Hearts'});
      const turn = {
        user: this.user2,
        cardsPlayed: [sevenHearts],
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: true,
        skipsRemaining: 0,
        endedRound: false
      }
      let shouldProcessTurn;
      try {
        shouldProcessTurn = await doc.shouldProcessTurn(turn);
      } catch (err) {
        console.log(err);
      }
      expect(shouldProcessTurn).toBeFalsy();
    });


  });

  describe('false', async function () {

    it('not your turn', async function() {  
      let doc = await Presidents.findOne({name: 'shd process turn test game'});
      const sevenHearts = await Card.find({shortHand: '7Hearts'});
      const turn = {
        user: mongoose.Types.ObjectId(),
        cardsPlayed: [sevenHearts]
      };
      let shouldProcessTurn;
      try {
        shouldProcessTurn = await doc.shouldProcessTurn(turn);
      } catch (err) {
        expect(err.message).toBe(`Unable to process turn. It is not your turn.`);
      }
    });

    it('invalid cards', async function() {  
      let doc = await Presidents.findOne({name: 'shd process turn test game'});
      const sevenHearts = await Card.findOne({shortHand: '7Hearts'});
      const eightHearts = await Card.findOne({shortHand: '8Hearts'});
      const user = await User.findById(doc.currentPlayer);
      console.dir(user)
      const turn = {
        user: user._id,
        cardsPlayed: [sevenHearts, eightHearts],
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: true,
        skipsRemaining: 0,
        endedRound: false
      };
      try {
        await doc.shouldProcessTurn(turn);
      } catch (err) {
        expect(err.message).toBe(`Unable to process turn. The cards selected are invalid.`);
      }
    });

    it('cards are not better', async function() {  
      let doc = await Presidents.findOne({name: 'shd process turn test game'});
      const sevenHearts = await Card.findOne({shortHand: '7Hearts'});
      const user = await User.findById(doc.currentPlayer);
      console.dir(user)
      const turn = {
        user: user._id,
        cardsPlayed: [sevenHearts],
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: true,
        skipsRemaining: 0,
        endedRound: false
      };
      try {
        await doc.shouldProcessTurn(turn);
      } catch (err) {
        expect(err.message).toBe(`Unable to process turn. The selected cards are not better. The rank of the selected cards does not beat the previous turns.`);
      }
    });

  });


});
