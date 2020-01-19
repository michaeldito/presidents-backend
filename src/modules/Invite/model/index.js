import mongoose from 'mongoose';

import InboxItem from '../../InboxItem/model';

const InviteSchema = new mongoose.Schema({
	sentBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'A sentBy is required to create an invite.'],
	},
	status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'InviteStatus',
		required: [true, 'A status is required to create an invite.'],
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: [true, 'A game is required to create an invite.'],
	},
});

InviteSchema.virtual('displayId').get(function() {
	const { username } = this.sentBy;
	const status = this.status.value;
	const game = this.game.kind;
	return `${username} - ${status} - ${game}`;
});

const Invite = InboxItem.discriminator('Invite', InviteSchema);

export default Invite;
