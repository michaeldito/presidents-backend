const { 
  GameStatus,
  PresidentsGame,
  GameConfiguration,
  User,
  Card,
  PoliticalRank
} = require('../../');
const mongoose = require('mongoose');
const expect = require('expect');


module.exports = async () => describe('#getNextPlayer()', async function() {   

  before(async function() {
    const status = await GameStatus.findByValue('NOT_STARTED');
    const config = await GameConfiguration.findOne({name: 'Presidents'});
    const user1 = mongoose.Types.ObjectId();
    const createdBy = user1;
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
      user: user1, 
      seatPosition: 0
    }

    const game = {
      createdBy,
      name,
      status,
      config,
      rules,
      players: [player]
    };
  
    await PresidentsGame.create(game);
  });

  describe('successful', async function () {

    before(async function() {
      const user2 = mongoose.Types.ObjectId();
      const user3 = mongoose.Types.ObjectId();
      const user4 = mongoose.Types.ObjectId();
      const user5 = mongoose.Types.ObjectId();
      const user6 = mongoose.Types.ObjectId();
      const user7 = mongoose.Types.ObjectId();
      const user8 = mongoose.Types.ObjectId();
      const users = [user2, user3, user4, user5, user6, user7, user8];
      let doc = await PresidentsGame.findOne({name: 'get next player prez game'});
      try {
        for (let user of users) {
          await doc.join(user);
        }
        await doc.initialize();
      } catch (err) {
        console.log(err);
      }
      expect(doc.players.length).toBe(8);
    })
  
    it('when called 8 times it `wraps around` the players array (length 8)', async function() {  
      let doc = await PresidentsGame.findOne({name: 'get next player prez game'});
      let current = doc.currentPlayer.toString();
      let i = 8;
      //console.log(`start ${current}`)
      while (i > 0) {
        let next = await doc.getNextPlayer();
        doc.currentPlayer = next.user;
        //console.log(`next ${doc.currentPlayer}`)
        await doc.save();
        i--;
      }
      //console.log('done')
      let newCurrent = doc.currentPlayer.toString();
      //console.log(`started with ${current}`)
      //console.log(`finished with ${newCurrent}`)
      expect(current).toBe(newCurrent);
    });

  });

  

});
