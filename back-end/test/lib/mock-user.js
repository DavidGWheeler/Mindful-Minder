'use strict';

const User = require ('../../model/user');

model.exports = function(done) {

  new User({
    username: 'Test User' + Math.floor(Math.random() * (100 -1)) +1,
    dateJoined: '2017-07-22',
    email: 'testuser' + Math.floor(Math.random() * (100 -1)) +1 + '@testmail.com',
    password: 'password',
    role: 'user',
  }).generatePasswordHash('123')
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch(done);
};
