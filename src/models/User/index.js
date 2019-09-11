const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  tokens: [{
    access: {
      type: String,
      required: [true, 'An access is required for every user\'s token.'],
    },
    value: {
      type: String,
      required: [true, 'A value is required for every user\'s token.'],
    }
  }]
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
}

UserSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({username});
  if (! user)
    return Promise.reject(new Error('username doesn\t exist.'));
  
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (res)
        resolve(user);
      else
        reject();
    });
  });
};

UserSchema.methods.generateAuthToken = async function (type) {
  const access = type === 'admin' ? 'admin' : 'user';
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  this.tokens = this.tokens.concat([{access, token}]);
  await this.save();
  return token;
};

UserSchema.methods.removeToken = function (token) {
  return this.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (err) {
    return Promise.reject('invalid token');
  }
  // query a nested doc
  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token
  });
};


UserSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({username});
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        resolve(user);
      }
      else {
        reject(new Error('invalid username and password combination.'));
      }
    });
  });
};

UserSchema.plugin(require('mongoose-unique-validator'));

const User = mongoose.model('User', UserSchema);

module.exports = User;