describe('addPlayer()', function() {   
      
  let users;
  let game;
  let gameConfig

  before(async function() {
    // users = await UserModel.findRandoms(9);
    // gameConfig = await GameConfigModel.findOne({name: 'Presidents'});
    // game = await GameModel.create(users[0], {name: 'join-game-test'}, gameConfig);
  })

  it('should throw error if user already joined', async function() {  
    try {
      await game.addPlayer(users[0]);
    } catch (err) {
      expect(err.message).toBe('User has already joined game.');
    }
  });

  it('should throw error if capacity reached', async function() { 
    const rest = users.slice(1, users.length-1); 
    for (let user of rest) {
      try {
        await game.addPlayer(user);
      } catch (err) {
        console.log('Couldn\'t add 7 players to make capacity 8. One of the users might be in the game already.');
      }
    } 
    const lastPlayer = users[users.length-1];
    try {
      await game.addPlayer(lastPlayer);
    } catch (err) {
      expect(err.message).toBe('Cannot join game. It is already full.');
    }      
  })


  it('should throw error if no user passed', async function() {    
    try {
      await game.addPlayer();
    } catch (err) {
      expect(err.message).toBe('Missing argument, user is required.');
    }
  });


  it('should throw error if game is in progress', async function() {    
    try {
      game.rounds = ['someRandomId'];
      await game.save();
      await game.addPlayer(users[0]);
    } catch (err) {
      expect(err.message).toBe('Cannot join game. It is already in progress.');
    }
  });


});
