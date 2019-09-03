describe('processTurn()', function() {   
  let users;
  let game;
  let gameConfig

  before(async function() {
    // users = await UserModel.findRandoms(2);
    // gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
    // game = await GameModel.create(users[0], {name: 'take-turn-test'}, gameConfig);
    // game = await game.addPlayer(users[1]);
    // game = await game.startFirstRound();
  })

  it.skip('should throw error if not players turn', async function() {  
  });

  it.skip('should throw error if passing and have cards selected', async function() {  
  });

  it.skip('should throw error if cards are not >= last turns cards', async function() {  
  });

  it.skip('should skip one time, so current player is the same', async function() {  
  });

  it.skip('skip makes game.turn.length === 2', async function() {  
  });

  it.skip('should finalize game when only 1 player has cards left', async function() {  
  });

  it.skip('should set next player correctly', async function() {  
  });

});
