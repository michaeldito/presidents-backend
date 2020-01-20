import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const env = process.env.NODE_ENV || 'dev';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'debug.log');

const logger = createLogger({
	// change level if in dev environment versus production
	level: env === 'dev' ? 'debug' : 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
	),
	transports: [
		new transports.Console({
			level: 'info',
			format: format.combine(
				format.colorize(),
				format.printf(
					info => `${info.timestamp} ${info.level}: ${info.message}`,
				),
			),
		}),
		new transports.File({ filename }),
	],
});

const enabled = false;

export default (msg, err) => 
	enabled && err ? 
		logger.error(msg) :
			enabled && logger.info(msg);
				
// logger.info('Hello world');
// logger.warn('Warning message');
// logger.debug('Debugging info');
