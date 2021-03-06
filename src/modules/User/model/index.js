const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A username is required to create a user.'],
    trim: true,
    minlength: 1,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    minlength: 1,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: [true, 'A password is required to create a user.'],
    minlength: 1
  },
  gamesPlayed: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Game'
  },
  token: {
    type: String
  },
  role: {
    type: String
  }
});


UserSchema.statics.findByUsername = function(username) {
  return this.findOne({username});
}

UserSchema.statics.findRandoms = function(howMany) {
  return this.find({}).limit(howMany);
}

UserSchema.statics.register = async function(user) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  const instance = new User(user);
  await instance.save();
  return instance;
}

UserSchema.methods.generateAuthToken = async function (options) {
  const token = jwt.sign(options, process.env.JWT_SECRET).toString();
  this.token = token;
  await this.save();
  return token;
}

UserSchema.statics.findByCredentials = async function ({username, password}) {
  const user = await this.findOne({username});

  if (! user)
    return Promise.reject(new Error('username doesn\'t exist.'));
  
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (res)
        resolve(user);
      else
        reject();
    });
  });
}

UserSchema.statics.findByToken = function (token) {
  console.log(`token passed to userschema ${token}`)
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`decoded ${decoded}`)
  }
  catch (err) {
    return Promise.reject('invalid token');
  }
  // query a nested doc
  return this.findOne({token});
}

UserSchema.plugin(require('mongoose-unique-validator'));

UserSchema.virtual('kind').get(function() {
  return 'User';
});

UserSchema.virtual('displayId').get(function() {
  return this.username + ' - ' + this.role;
});
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;