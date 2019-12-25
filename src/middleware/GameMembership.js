const { User } = require('../models');

const GameMembership = async (ctx, next) => {
  const token  = ctx.cookies.get('access_token');
  const { id } = ctx.params;
  const doc = await User.findByToken(token);

  if (! doc)  {
    console.log(`[GameMembership] DENIED - no user found for token`);
    return false;
  }
  const isMember = doc.gamesPlayed.find(game => game._id === id);
  if (isMember) {
    console.log(`[GameMembership] DENIED - user is not a member of the game`);
    return false;
  }
  
  console.log(`[GameMembership] APPROVED - user is a member of the game`);
  return next();
};


module.exports = GameMembership;