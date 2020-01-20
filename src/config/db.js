import mongoose from 'mongoose';

import config from '../config/config';
import logger from './logger';
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
		logger('[Database] failed to connect to mongodb');
		logger(`[Database] error: ${err}`);
	}
};

export const close = async () => {
	try {
		await mongoose.connection.close();
		console.log('[Database] disconnected from mongodb');
	} catch (err) {
		logger('[Database] failed to disconnect from mongodb');
		logger(`[Database] error: ${err}`);
	}
};

const db = {
	connect,
	close
};

export default db;
