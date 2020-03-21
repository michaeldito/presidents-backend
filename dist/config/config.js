"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var env = process.env.NODE_ENV || 'dev';
var config = {
  "dev": {
    "MONGODB_URI": "mongodb+srv://root:root@cluster0-3p4qe.mongodb.net/db-tests?retryWrites=true",
    "JWT_SECRET": "1234",
    "TWILIO_ACCOUNT_SID": "ACa7a9aa8c52b95c6b147f1d6e87e62b6c",
    "TWILIO_API_KEY": "SKda8f880987fb49d2afae36dfaa38d11c",
    "TWILIO_API_SECRET": "iZTwlQyYwQQeD7xO1Qsf2KkAYWiHz0YO",
    "TWILIO_CHAT_SERVICE_SID": "IS415ec904ec6a4c9792fe8fb649066805",
    "PORT": 8080
  },
  "prod": {
    "MONGODB_URI": "mongodb+srv://root:root@cluster0-3p4qe.mongodb.net/test?retryWrites=true",
    "JWT_SECRET": "1234",
    "TWILIO_ACCOUNT_SID": "ACa7a9aa8c52b95c6b147f1d6e87e62b6c",
    "TWILIO_API_KEY": "SKda8f880987fb49d2afae36dfaa38d11c",
    "TWILIO_API_SECRET": "iZTwlQyYwQQeD7xO1Qsf2KkAYWiHz0YO",
    "TWILIO_CHAT_SERVICE_SID": "IS415ec904ec6a4c9792fe8fb649066805"
  }
};
var envConfig = config[env];

var _default = () => {
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
};

exports.default = _default;