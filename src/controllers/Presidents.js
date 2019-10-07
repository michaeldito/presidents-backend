const {PresidentsGame} = require('../models');

module.exports.briefDetails = async (ctx) => {

  try {

    let docs = await PresidentsGame.find({});

    docs = docs.map(doc => {
      let { name, createdAt, startedAt, finishedAt, status, createdBy, winner } = doc;
      return { name, createdAt, startedAt, finishedAt, status, createdBy, winner };
    });

    let body = docs.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.create = async (ctx) => {

  const { name, createdBy, rules } = ctx.request.body;

  try {

    const doc = await PresidentsGame.create({ name, createdBy, rules });
    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.gameDetails = async (ctx) => {

  const { id } = ctx.params;

  try {

    const doc = await PresidentsGame.findById(id);
    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};


module.exports.join = async (ctx) => {

  const { id } = ctx.params;
  const userId = ctx.request.body;

  try {

    let doc = await PresidentsGame.findById(id);
    await doc.join(userId)
    const body = doc.toObject();

    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};

module.exports.initialize = async (ctx) => {

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

  const { id } = ctx.params;
  const { user, cardsPlayed, wasPassed } = ctx.request.body;

  try {

    let body;
    let doc = await PresidentsGame.findById(id);
    let { currentPlayer, handToBeat } = doc;

    if (wasPassed) {
      doc = await doc.processTurn({
        user,
        wasPassed,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: false
      });
      body = doc.toObject();

    } else {
      let turn = { user, cardsPlayed, wasPassed };
      let shouldProcessTurn = await PresidentsGame.shouldProcessTurn(currentPlayer, handToBeat, turn);
      turn.skipsRemaining = PresidentsGame.calculateSkips(handToBeat, turn.cardsPlayed);
      turn.didCauseSkips = turn.skipsRemaining > 0;

      if (shouldProcessTurn) {
        doc = await doc.processTurn(turn);
        if (turn.didCauseSkips) {
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
            doc = await doc.processTurn(skipTurn);
          }
        }
        if (doc.didCurrentPlayersLastTurnEndTheRound) {
          // mark as round ender
          // init next round
        }
        body = doc.toObject();
      }
    }
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};

module.exports.giveDrink = async (ctx) => {

  const { id } = ctx.params;
  const { toUser, fromUser } = ctx.request.body;

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

  const { id } = ctx.params;

  try {

    let doc = await PresidentsGame.findById(id);
    
    let players = doc.players.sort((a, b) => (a.seatPosition < b.seatPosition) ? 1 : -1);
    players = players.map(player => {
      let { user, nextGameRank } = player;
      return { user, nextGameRank };
    });

    let { rules, createdBy } = doc;
    let name = doc.name + '-rematch';
    doc = await PresidentsGame.create({name, rules, createdBy});

    for (let player of players) {
      doc = await doc.join(player);
    }

    doc = await doc.initialize();
    doc = await doc.initializeNextRound();
    const body = doc.toObject();
    
    ctx.status = 200;
    ctx.body = body;

  } catch (err) {
    ctx.throw(400, err);
  }  
};