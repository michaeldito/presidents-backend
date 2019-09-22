const { GameConfiguration, User, Card, GameStatus } = require('../../') ;


module.exports = async () => describe.skip('#processSkips()', async function() {   

  before(async function() {
    const status = await GameStatus.findByValue('NOT_STARTED');
    const config = await GameConfiguration.findOne({name: 'Presidents'});
    const user1 = await User.findByUsername('tommypastrami');
    const user2 = await User.findByUsername('bella');
    const user3 = await User.findByUsername('tony');
    const currentPlayer = user1;
    const createdBy = currentPlayer;
    const name = 'process skips prez game';

    this.handToBeat = await Card.findOne({shortHand: 'JHearts'});
    this.jackSpades = await Card.findOne({shortHand: 'JClubs'});
    this.jackDiamonds = await Card.findOne({shortHand: 'JDiamonds'});
    this.jackClubs = await Card.findOne({shortHand: 'JClubs'});

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
      user1,
      joinedAt: new Date(),
      seatPosition: 0,
    };

    const player2 = {
      user: user2,
      joinedAt: new Date(),
      seatPosition: 1,
    };

    const player3 = {
      user: user3,
      joinedAt: new Date(),
      seatPosition: 2,
    };

    const game = {
      createdBy,
      name,
      status,
      config,
      rules,
      currentPlayer,
      rounds: [{
        turns: []
      }],
      players: [player1,player2, player3]
    };
  
    await PresidentsGame.create(game);
  });

  describe('skips successful', async function () {
  
    it('1 skip', async function() {  
    
    });

    it('2 skip', async function() {  
    
    });

    it('3 skip', async function() {  
    
    });

    it('each skip added should result in skipsRemaining decreasing by 1', async function() {  
    
    });

    it('each skip should be for the next player', async function() {  
    
    });

  });
  

});
