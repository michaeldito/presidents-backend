const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
  const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
  mongoose.Promise = global.Promise;
  await mongoose.connect(process.env.MONGODB_URI_TEST, options);
}
  
