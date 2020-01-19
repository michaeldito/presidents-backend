import mongoose from 'mongoose';

export default async function(fn) {
	console.log('[Transaction] beginning session');
	const session = await mongoose.startSession();

	try {
		console.log('[Transaction] beginning transaction');
		session.startTransaction();

		await fn();

		console.log('[Transaction] committing transaction');
		await session.commitTransaction();
		console.log('[Transaction] transaction complete');
	} catch (err) {
		await session.abortTransaction();
		console.log('[Transaction] transaction aborted');
		console.log(err);
		throw err;
	} finally {
		console.log('[Transaction] ending session');
		session.endSession();
	}
}
