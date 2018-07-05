const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', function(done) {
  const user = this;

  if (!user.isModified('password')) { return done(); }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return done(err); }

    bcrypt.hash(user.password, salt, () => {}, (err, hash) => {
      if (err) { return done(err); }
      user.password = hash;
      done();
    });
  });
});

userSchema.methods.verifyPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
