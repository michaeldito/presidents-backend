

module.exports.methodTests = async () => describe('Model Method Tests', function() {
    
  describe('startFirstRound()', function() {   
    let users;
    let game;
    let gameConfig
  
    before(async function() {
      // users = await UserModel.findRandoms(2);
      // gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
      // game = await GameModel.create(users[0], {name: 'start-game-test'}, gameConfig);
      // game = await game.addPlayer(users[1]);
      // game = await game.startFirstRound();
    })
  
    it('should set allowed ranks on game', async function() {  
    });
  
    it('should add a round to game', async function() {    
    });
  
    it('players should have been dealt 26 cards each', async function() { 
  
    });
  
    it('game.currentRound is set & game.round.roundNumber is 1', async function() {
  
    });
  
    it('game.round.currentPlayer should have 3 ♣', async function() {
    });
  
    it('all players should have one rank assignment', async function() {  
  
    });
  
    it('all players should have one null rank assignment', async function() { 
  
    });
  
    it('round.playerRankAssignments should have 2 null ranks', async function() {  
  
    });
  
    it('trying to start a finalized game throws error', async function() {  
  
    });
  
    it('trying to start a game with < 2 players throws error', async function() {  
      
    });
  
  });
  
  
});