import mongoose from 'mongoose';

import logger from '../config/logger';

export default async function(fn) {
	logger('[Transaction] beginning session');
	const session = await mongoose.startSession();

	try {
		logger('[Transaction] beginning transaction');
		session.startTransaction();
		await fn();
		logger('[Transaction] committing transaction');
		await session.commitTransaction();
		logger('[Transaction] transaction complete');
	} 
	catch (err) {
		await session.abortTransaction();
		logger('[Transaction] transaction aborted');
		logger(err);
		throw err;
	} 
	finally {
		logger('[Transaction] ending session');
		session.endSession();
	}
}
