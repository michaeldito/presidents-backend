const mongoose = require('mongoose');
require('dotenv').config();

module.exports.connect = async () => {
  const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
  mongoose.Promise = global.Promise;
  try {
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
    console.log('[Database] connected to mongodb');
  } catch (err) {
    console.log('[Database] failed to connect to mongodb');
    console.log(`[Database] error: ${err}`);
  }
}

module.exports.close = async () => {
  try {
    await mongoose.connection.close();
    console.log('[Database] disconnected from mongodb');
  } catch (err) {
    console.log('[Database] failed to disconnect from mongodb');
    console.log(`[Database] error: ${err}`);  }
}
  
