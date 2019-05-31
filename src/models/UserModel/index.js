const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 1
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.statics.findByUsername = function(username) {
  return this.findOne({username});
}


//
//
// Code below is not tested!
//
//


// Arrow functions do not bind a this keyword.
// We need a this keyword for our user methods! 
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  // user.save() returns a promise, so we call .then()
  // Usually we return inside of this line, but here it's
  // legal because we're returning the value of the callback.
  return user.save().then(() => {
    return token;
  });
};



// Statics are model methods, not instance methods.
// Methods get called with the individual document.
// Model methods get called with the model as the 'this' binding.
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    // token to decode, and secret
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (e) {
    // when the token is invalid, return a promise that is
    // always going to reject. 
    return Promise.reject();
  }
  // return the promise so that we can do chaining in server.js
  return User.findOne({
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
  var User = this;

  return User.findOne({email}).then((user) => {
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


// $pull lets you remove an item from an array that matches criteria
UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;