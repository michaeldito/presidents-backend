module.exports = async (ctx, next) => {
  const { token }  = ctx.state.jwtdata.token;
  const doc = await User.findByToken(token);
  if (! doc) 
    return false;
  return next();
};