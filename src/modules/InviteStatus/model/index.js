import mongoose from 'mongoose';

import Status from '../../Status/model';

const InviteStatusSchema = new mongoose.Schema({});
const InviteStatus = Status.discriminator('InviteStatus', InviteStatusSchema);

export default InviteStatus;
