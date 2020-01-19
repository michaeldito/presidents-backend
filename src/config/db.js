import mongoose from 'mongoose';

import config from '../config/config';
config();

export const connect = async () => {
	const options = {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	};
	mongoose.Promise = global.Promise;
	try {
		await mongoose.connect(process.env.MONGODB_URI, options);
		console.log('[Database] connected to mongodb');
	} catch (err) {
		console.log('[Database] failed to connect to mongodb');
		console.log(`[Database] error: ${err}`);
	}
};

export const close = async () => {
	try {
		await mongoose.connection.close();
		console.log('[Database] disconnected from mongodb');
	} catch (err) {
		console.log('[Database] failed to disconnect from mongodb');
		console.log(`[Database] error: ${err}`);
	}
};

const db = {
	connect,
	close
};

export default db;
