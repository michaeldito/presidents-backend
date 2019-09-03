const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A username is required for every user.'],
    trim: true,
    minlength: 1,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'A password is required for every user.'],
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


//
//
// Code below is not tested!
//
//


// Arrow functions do not bind a this keyword.
// We need a this keyword for our user methods! 
UserSchema.methods.generateAuthToken = function () {

  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  // user.save() returns a promise, so we call .then()
  // Usually we return inside of this line, but here it's
  // legal because we're returning the value of the callback.
  return this.save().then(() => {
    return token;
  });
};


// $pull lets you remove an item from an array that matches criteria
UserSchema.methods.removeToken = function (token) {

  return thid.update({
    $pull: {
      tokens: {token}
    }
  });

};


// Statics are model methods, not instance methods.
// Methods get called with the individual document.
// Model methods get called with the model as the 'this' binding.
UserSchema.statics.findByToken = function (token) {

  let decoded;

  try {
    // token to decode, and secret
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (e) {
    // when the token is invalid, return a promise that is
    // always going to reject. 
    return Promise.reject(new Error('Invalid token.'));
  }
  // return the promise so that we can do chaining in server.js
  return this.findOne({
    '_id': decoded._id,
    // find a user whose tokens arry has an object where tokens has a token
    // that equals token prop we have here.
    // to query a nested doc wrap value in quotes and specify
    // what to query for
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};


UserSchema.statics.findByCredentials = function (email, password) {

  return this.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        }
        else {
          reject();
        }
      });
    });
  });

};


const User = mongoose.model('User', UserSchema);

module.exports = User;