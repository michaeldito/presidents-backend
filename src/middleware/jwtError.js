module.exports = (ctx, err) => {
  if(err.status === 401) {
    console.log('[index.js] Sending 401 to the client.');
    ctx.status = 401;
    ctx.body = 'JWT Token expired.';
  } else {
    console.log('[index.js] One of the modules in the chain fired an exception.');
    console.log(`[index.js] The error message is ${err}`);
  }
};