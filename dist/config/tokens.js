"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.videoToken = exports.chatToken = void 0;

var _twilio = _interopRequireDefault(require("twilio"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  AccessToken
} = _twilio.default.jwt;
var {
  ChatGrant,
  VideoGrant
} = AccessToken;

var chatToken = identity => {
  var chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  });
  var token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
  token.addGrant(chatGrant);
  token.identity = identity;
  return token.toJwt();
};

exports.chatToken = chatToken;

var videoToken = (identity, room) => {
  var videoGrant;

  if (typeof room !== 'undefined') {
    videoGrant = new VideoGrant({
      room
    });
  } else {
    videoGrant = new VideoGrant();
  }

  var token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
  token.addGrant(videoGrant);
  token.identity = identity;
  return token.toJwt();
};

exports.videoToken = videoToken;
var Tokens = {
  chatToken,
  videoToken
};
var _default = Tokens;
exports.default = _default;