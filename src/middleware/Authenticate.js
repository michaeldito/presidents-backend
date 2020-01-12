const User = require('../modules/User/model');

const Authenticate = allowedRoles => {
  return async (ctx, next) => {
    const token  = ctx.cookies.get('access_token');
    const doc = await User.findByToken(token);

    if (! doc)  {
      console.log(`[Authentication] no user found for token`);
      ctx.body = `[Authentication] no user found for token`;
      return false;
    }
    if (! allowedRoles.find(role => role === doc.role)) {
      console.log(`[Authentication] DENIED - user does not have security clearance of ${allowedRoles}`);
      ctx.body = `[Authentication] DENIED - user does not have security clearance of ${allowedRoles}`;
      return false;
    }
    
    console.log(`[Authentication] APPROVED - user has security clearance of ${allowedRoles}`);
    ctx.body = `[Authentication] APPROVED - user has security clearance of ${allowedRoles}`;
    return next();
  };
}

module.exports = Authenticate;
