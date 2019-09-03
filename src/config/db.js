const mongoose = require('mongoose');
require('dotenv').config();

module.exports.connect = async () => {
  const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
  mongoose.Promise = global.Promise;
  await mongoose.connect(process.env.MONGODB_URI_TEST, options);
}

module.exports.close = async () => {
  await mongoose.connection.close();
}
  
