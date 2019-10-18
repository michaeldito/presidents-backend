const {PresidentsGame, User, GameConfiguration, GameStatus, Card} = require('../models');
const mongoose = require('mongoose');

module.exports.briefDetails = async (ctx) => {
  console.log(`[koa@GET('/presidents/briefDetails')]`);

  try {

    let docs = await PresidentsGame.find({});

    docs = docs.map(doc => {
      let { id, name, createdAt, startedAt, finishedAt, status, createdBy, winner } = doc;
      let type = doc.config.name;
      if (! winner) {
        winner = '-';
      }
      return { id, name, type, createdAt, startedAt, finishedAt, status, createdBy, winner };
    });

    console.log(`[koa@GET('/presidents/briefDetails')] found ${docs.length} docs`);

    let body = docs;

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.create = async (ctx) => {
  console.log(`[koa@POST('/presidents/create')]`);
  console.log(ctx.request.body)
  let { name, createdBy, gameType } = ctx.request.body;
  console.log({ name, createdBy, gameType })

  let rules = {
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

  try {
    console.log(`[koa@POST('/presidents')] 1`);

    let config = await GameConfiguration.findOne({ name: gameType });
    config = config._id;
    console.log(`[koa@POST('/presidents')] 2`);

    let status = await GameStatus.findByValue('NOT_STARTED');
    status = status._id;
    console.log(`[koa@POST('/presidents')]3`);

    let user = await User.findById(createdBy);
    console.log(`user: ${user}`)
    user = user._id;
    const game = { name, status, createdBy: user, rules, config };

    console.log(`[koa@POST('/presidents')] creating the game`);
    console.log(`[koa@POST('/presidents')] ${game}`);
    let doc = await PresidentsGame.create(game);

    console.log(`[koa@POST('/presidents')] adding creator to the game`);
    doc = await doc.join(user);

    console.log(`[koa@POST('/presidents')] adding game to creators gamesPlayed`);
    user = await User.findOne(user);
    user.gamesPlayed = user.gamesPlayed.concat([doc._id]);
    await user.save();

    doc = await PresidentsGame.findOne({_id: doc._id});

    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.gameDetails = async (ctx) => {
  console.log(`[koa@GET('/presidents/gameDetails')]`);

  const { id } = ctx.params;

  try {

    const doc = await PresidentsGame.findById(id);
    console.log(`[koa@GET('/presidents/gameDetails')] game: ${doc}`);
    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.join = async (ctx) => {
  console.log(`[koa@PUT('/presidents/join')]`);

  const { id } = ctx.params;
  let { userId } = ctx.request.body;
  console.log(`[koa@PUT('/presidents/join')] user: ${userId}`);

  try {

    console.log(`[koa@POST('/presidents/join')] adding user to game`);
    let user = await User.findById(userId);
    console.log(`[koa@PUT('/presidents/join')] ${user}`);
    let doc = await PresidentsGame.findById(id);
    doc = await doc.join(user)

    console.log(`[koa@POST('/presidents/join')] adding game to creators gamesPlayed`);
    user.gamesPlayed.push(doc._id);
    user = await user.save();

    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.initialize = async (ctx) => {
  console.log(`[koa@PUT('/presidents/initialize')]`);

  const { id } = ctx.params;

  try {

    let doc = await PresidentsGame.findById(id);
    await doc.initialize();
    await doc.initializeNextRound();
    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.processTurn = async (ctx) => {
  console.log(`[koa@PUT('/presidents/processTurn')]`);

  const { id } = ctx.params;
  let { user, cardsPlayed, wasPassed } = ctx.request.body;

  try {

    let body;

    let doc = await PresidentsGame.findById(id);
    let { handToBeat } = doc;

    // user is passing
    if (wasPassed && user === doc.currentPlayer.toString()) {
      console.log(`[koa@PUT('presidents/processTurn')] turn was a pass`);

      if (cardsPlayed.length > 0) {
        ctx.throw(400, 'cannot pass and submit cards');
      }

      let turn = {
        user, 
        cardsPlayed,
        wasPassed,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: false
      };

      doc = await doc.processTurn(turn);
      body = doc.toObject();
    } else {

      // user is not passing
      console.log(`[koa@PUT('presidents/processTurn')] turn is not a pass`);
      let turn = { user, cardsPlayed, wasPassed };
      
      console.log(`[koa@PUT('presidents/processTurn')] should we process this turn?`);
      let shouldProcessTurn = await doc.shouldProcessTurn(turn);

      // is the turn valid and better, or a special card?
      if (shouldProcessTurn) {
        console.log(`[koa@PUT('presidents/processTurn')] we need to process this turn`);
        console.log(`[koa@PUT('presidents/processTurn')] will it cause any skips?`);
        turn.skipsRemaining = PresidentsGame.calculateSkips(handToBeat, turn.cardsPlayed);
        turn.didCauseSkips = turn.skipsRemaining > 0;
        turn.wasSkipped = false;
        turn.endedRound = false;

        doc = await doc.processTurn(turn);

        // process any skips
        if (turn.didCauseSkips) {
          console.log(`[koa@PUT('presidents/processTurn')] we also need to process ${turn.skipsRemaining} skips`);
          while (turn.skipsRemaining) {
            turn.skipsRemaining--;
            const skipTurn = {
              user: doc.currentPlayer,
              cardsPlayed: [],
              wasPassed: false,
              wasSkipped: true,
              didCauseSkips: false,
              skipsRemaining: turn.skipsRemaining,
              endedRound: false
            };
            console.log(`[koa@PUT('presidents/processTurn')] time to process a skip`);
            doc = await doc.processTurn(skipTurn);
          }
        }
      }
    }

    console.log(`[koa@PUT('presidents/processTurn')] did the next player's last turn end the round?`);
    let didCurrentPlayersLastTurnEndTheRound = doc.didCurrentPlayersLastTurnEndTheRound();
    console.log(`[koa@PUT('presidents/processTurn')] didCurrentPlayersLastTurnEndTheRound ${didCurrentPlayersLastTurnEndTheRound}`);
    if (didCurrentPlayersLastTurnEndTheRound) {

      // mark as round ender
      // init next round
      // reset hand to beat for next round
      console.log(`[koa@PUT('presidents/processTurn')] let's initialize the next round & reset the hand to beat`);
      doc = await doc.initializeNextRound();
      doc.handToBeat = [];
      doc = await doc.save();
    }


    body = doc.toObject();
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.giveDrink = async (ctx) => {
  console.log(`[koa@PUT('/presidents/giveDrink')]`);

  const { id } = ctx.params;
  let { toUser, fromUser } = ctx.request.body;

  try {

    let doc = await PresidentsGame.findById(id);
    doc = await doc.giveDrink(fromUser, toUser);
    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.drinkDrink = async (ctx) => {
  console.log(`[koa@PUT('/presidents/drinkDrink')]`);

  const { id } = ctx.params;
  const { user } = ctx.request.body;

  try {

    let doc = await PresidentsGame.findById(id);
    doc = await doc.drinkDrink(user);
    const body = doc.toObject();
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.rematch = async (ctx) => {
  console.log(`[koa@POST('/presidents/rematch')]`);

  const { id } = ctx.params;

  try {

    let doc = await PresidentsGame.findById(id);
    
    console.log(`[koa@POST('/presidents/rematch')] sorting players by seat position`);
    let players = doc.players.sort((a, b) => (a.seatPosition < b.seatPosition) ? 1 : -1);

    let usersToAdd = [];
    console.log(`[koa@POST('/presidents/rematch')] grabbing their userId and nextGameRanks`);
    for (let player of players) {
      let { user, nextGameRank } = player;
      user = await User.findById(user);
      usersToAdd.push({ _id: user._id, nextGameRank });
    }

    let { rules, createdBy, config } = doc;
    let name = `${doc.name}-rematch-${mongoose.Types.ObjectId()}`
    let status = await GameStatus.findByValue('NOT_STARTED');

    console.log(`[koa@POST('/presidents/rematch')] creating a rematch game with same configs`);
    doc = await PresidentsGame.create({name, status, rules, createdBy, config});

    for (let user of usersToAdd) {
      console.log(`[koa@POST('/presidents/rematch')] adding user ${user._id}`);
      doc = await doc.join(user);
    }

    console.log(`[koa@POST('/presidents/rematch')] initializing the game`);
    doc = await doc.initialize();
    doc = await doc.initializeNextRound();
    const body = doc.toObject();
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};