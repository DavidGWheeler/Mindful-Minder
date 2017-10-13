'use strict';

const debug = require('debug')('mindful:mock-reminder');
const tempUser = require('./mock-user');
const Reminder = require('../../model/reminder');

module.exports = function(done) {
  debug('create mock reminder');
  tempUser.call(this, err => {
    if(err)
    return done(err);
  new Reminder({
    title: 'Test Reminder',
    date: '2017-07-22',
  },
  description: 'Lorem ipsum dolor sit amet.',
  message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  })
    .save()
    .then(reminder => {
      this.tempReminder = reminder;
      done();
    })
  .catch(done);
  }),
};
