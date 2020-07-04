const GameStatus = require('../../../GameStatus/model');
const Presidents = require('../');
const GameConfiguration = require('../../../GameConfiguration/model');
const User = require('../../../User/model');

const expect = require('expect');


module.exports = async () => describe('#getNextPlayer()', async function() {   

  before(async function() {
    const status = await GameStatus.findByValue('NOT_STARTED');
    const config = await GameConfiguration.findOne({name: 'Presidents'});
    const users = await User.find({});

    const createdBy = users[0];
    const name = 'get next player prez game';
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
    const player = {
      user: users[0], 
      seatPosition: 0,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player1 = {
      user: users[1], 
      seatPosition: 1,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player2 = {
      user: users[2], 
      seatPosition: 2,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player3 = {
      user: users[3], 
      seatPosition: 3,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player4 = {
      user: users[4], 
      seatPosition: 4,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player5 = {
      user: users[5], 
      seatPosition: 5,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player6 = {
      user: users[6], 
      seatPosition: 6,
      drinksDrunk: 0,
      drinksReceived: [],
      drinksSent: []
    };
    const player7 = {
      user: users[7], 
      seatPosition: 7,
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
      players: [player, player2, player3, player4, player5, player6, player7, player1]
    };
  
    await Presidents.create(game);
    

  });

  describe('successful', async function () {
  
    it('when called 8 times it `wraps around` the players array (length 8)', async function() {  
      let doc = await Presidents.findOne({name: 'get next player prez game'});
      await doc.initialize();
      await doc.initializeNextRound();
      doc = await Presidents.findOne({name: 'get next player prez game'});
      expect(doc.players.length).toBe(8);
      let current = doc.currentPlayer.toString();
      let i = 8;
      console.log(`start ${current}`)
      while (i > 0) {
        let next = await doc.getNextPlayer();
        doc.currentPlayer = next;
        console.log(`next ${doc.currentPlayer}`)
        await doc.save();
        i--;
      }
      console.log('done')
      let newCurrent = doc.currentPlayer.toString();
      console.log(`started with ${current}`)
      console.log(`finished with ${newCurrent}`)
      expect(current).toBe(newCurrent);
    });

  });

  

});
