const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const { ChatGrant, VideoGrant } = AccessToken;

const chatToken = (identity) => {
  let chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  });
  let token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  );
  token.addGrant(chatGrant);
  token.identity = identity;
  return token.toJwt()
};

const videoToken = (identity, room) => {
  let videoGrant;
  if (typeof room !== 'undefined') {
    videoGrant = new VideoGrant({ room });
  } else {
    videoGrant = new VideoGrant();
  }
  let token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  );
  token.addGrant(videoGrant);
  token.identity = identity;
  return token.toJwt()
};

module.exports = { chatToken, videoToken };
