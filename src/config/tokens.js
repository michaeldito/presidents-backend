import twilio from 'twilio';

const { AccessToken } = twilio.jwt;
const { ChatGrant, VideoGrant } = AccessToken;

export const chatToken = identity => {
	const chatGrant = new ChatGrant({
		serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
	});
	const token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID,
		process.env.TWILIO_API_KEY,
		process.env.TWILIO_API_SECRET,
	);
	token.addGrant(chatGrant);
	token.identity = identity;

	return token.toJwt();
};

export const videoToken = (identity, room) => {
	let videoGrant;
	if (typeof room !== 'undefined') {
		videoGrant = new VideoGrant({ room });
	} else {
		videoGrant = new VideoGrant();
	}
	const token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID,
		process.env.TWILIO_API_KEY,
		process.env.TWILIO_API_SECRET,
	);
	token.addGrant(videoGrant);
	token.identity = identity;

	return token.toJwt();
};

const Tokens = { 
	chatToken, 
	videoToken 
};

export default Tokens;
