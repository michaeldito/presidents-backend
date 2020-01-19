const env = process.env.NODE_ENV || 'dev';

import config from './config.json';

const envConfig = config[env];

export default () => {
	Object.keys(envConfig).forEach(key => {
		process.env[key] = envConfig[key];
	});
};
