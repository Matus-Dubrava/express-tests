const chai = require('chai');
const expect = chai.expect;

const mongoose = require('mongoose');

const User = require('../models/user-model');
const dbURI = 'mongodb://localhost:27017/user-test'

describe('database user operation', () => {
  before(function(done) {
    mongoose.connect(dbURI);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('Connection established');
      done();
    });
  });

  afterEach(function(done) {
    User.remove({}).then(() => { done(); });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  it ('should store a new user in a database', function(done) {

      const username = 'name'
      const password = 'password';

      const u = new User({ username, password });

      u.save()
        .then((user) => {
          done()
        }).catch((e) => {
          done(e);
        });
  });

  it ('should not store two users with the same name', function(done) {

    const username = 'name';
    const password1 = 'secret';
    const password2 = 'password';

    const u1 = new User({ username, password: password1 });
    const u2 = new User({ username, password: password2 });

    Promise.all([
      u1.save(),
      u2.save()
    ]).then(() => {
      done(new Error('two users with the same name have been stored'));
    })
    .catch(() => {
      done()
    });
  });

  it ('should store passwords in hashed form', (done) => {

    const username = 'name'
    const password = 'password';

    const u = new User({ username, password });

    u.save()
      .then((user) => {
        user.password === password
          ? done(new Error('password was not hashed'))
          : done();
      });
  });

  it ('different users with the same password should not share the same hashed password', (done) => {

    const u1 = new User({
      username: 'name1',
      password: 'secret'
    });

    const u2 = new User({
      username: 'name2',
      password: 'secret'
    });

    Promise.all([
      u1.save(),
      u2.save()
    ]).then(() => {
      u1.password === u2.password
        ? done(new Error('two same passwords hashed to the same value'))
        : done();
    });
  });

  it (`user's hashed password should be successfuly verified agains its plain form`, (done) => {

    const username = 'name'
    const password = 'password';

    const u = new User({ username, password });

    u.save()
      .then((user) => {
        user.verifyPassword(password, (err, isMatch) => {
          if (err) { done(err); }
          isMatch
            ? done()
            : done(new Error('user password was not verified correctly'));
        });
      });
  });

  it (`user can be removed from database`, (done) => {

    const username = 'name'
    const password = 'password';

    const u1 = new User({ username, password });
    const u2 = new User({ username, password });

    u1.save()
      .then(() => {
        return User.remove({ username });
      }).then(() => {
        return u2.save()
      }).then((user) => {
        done();
      }).catch((e) => {
        done(e);
      })
  });
});
