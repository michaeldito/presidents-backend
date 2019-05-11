const setAccessToken = require('./setAccessToken');

module.exports = () => {
  return (ctx, next) => {
    const loggedIn = ctx.state.jwtdata.user.loggedIn;

     if (loggedIn !== true) {
        return false;
    }
    setAccessToken(ctx, ctx.state.jwtdata.user);
    return next();
  };
};


