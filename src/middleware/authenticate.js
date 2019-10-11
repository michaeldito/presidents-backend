const {User} = require('../models');

module.exports = async (ctx, next) => {
  const { token }  = ctx.state.jwtdata.token;
  const doc = await User.findByToken(token);

  console.log(`[Authentication] found user: ${!!doc}`);
  console.log(`[Authentication] ${doc}`);

  if (! doc) 
    return false;
  return next();
};