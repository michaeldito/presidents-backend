const { 
  GameStatus,
  PresidentsGame,
  GameConfiguration,
  User,
  Card,
  PoliticalRank
} = require('../../');
const expect = require('expect');


module.exports = async () => describe('#giveDrink()', async function() {   
  
  before(async function() {
    const status = await GameStatus.findByValue('FINALIZED');
    const config = await GameConfiguration.findOne({name: 'Presidents'});
    const currentPlayer = await User.findByUsername('tommypastrami');
    const createdBy = currentPlayer;
    const hand = await Card.find({}).limit(5);
    const user = currentPlayer;
    const name = 'next round prez game';
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
    const winner = user;
    const politicalRank = await PoliticalRank.findByName('President');
    const nextGameRank = politicalRank;
    const drinksDrunk = 0;
    const drinksReceived = [{ createdAt: new Date(), sentBy: user }];
    const drinksSent = [{ createdAt: new Date(), sentTo: user }];
    const player = {
      user,
      joinedAt: new Date(),
      seatPosition: 1,
      hand,
      politicalRank,
      nextGameRank,
      drinksDrunk,
      drinksReceived,
      drinksSent
    };

    const game = {
      winner,
      createdBy,
      name,
      status,
      config,
      rules,
      currentPlayer,
      rounds: [],
      players: [player,player]
    };
  
    await PresidentsGame.create(game);
  });

  describe('validations', async function () {

    it('player has a drink to drink from other player already', async function() {  

    });

  });

  describe('successful', async function () {

    it('player now has a drink received from user', async function() {  

    });

    it('player who sent also has a drink sent', async function() {  

    });

  });

});
