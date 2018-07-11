'use strict';

const debug = require('debug')('mindfulMinder: reminderCtrl');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const del = require('del');
const createError = require('http-errors');
const Promise = require('bluebird');
const dataDir = `${__dirname}/../data`;

const Reminder = require('../model/reminder');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();

function s3UploadProm(params){
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(createError(err.status, err.name));
      return resolve(data);
    });
  });
}

function s3DeleteProm(params){
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) return reject(createError(err.status, err.name));
      return resolve(data);
    });
  });
}

module.exports = exports = {};

exports.createReminder = function(req){
  debug('#reminderCtrl createReminder');

  if(!req.User) return Promise.reject(createError(400, 'Id required'));

  req.body.userId = req.user._id;

  if (req.file) {
    let ext = path.extname(req.file.originalname);
    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${ext}`,
      Body: fs.createReadStream(req.file.path),
    };
    return s3UploadProm(params)
  .then(s3Data => {
    del([`${dataDir}/*`]);
    req.body.photo = {
      imageURI: s3Data.Location,
      ObjectId: s3Data.Key,
    };
    return new Reminder(req.body).save();
  })
  .catch(err => Promise.reject(createError(err.status, err.message)));
  } else {

    return new Reminder(req.body).save()
  .then(reminder => reminder)
  .catch(err => Promise.reject(createError(err.status, err.message)));
  }
};

exports.fetchReminder = function(req) {
  if(!req.user._id) return Promise.reject(createError(400, 'ID required'));

  return Reminder.find({userId: req.user._id})
    .catch(err => Promise.reject(createError(err.status, err.message)));
};

exports.getCalendar = function(req) {
  return Reminder.find({})
  .catch(err => Promise.reject(createError(err.status, err.message)));
};

exports.updateReminder = function(req) {
  if(!req.params.id) return Promise.reject(createError(400, 'ID required'));
  if(req.file) {
    return Reminder.find({_id: req.params.id, userId: req.user._id})
      .then(reminder => {
        if(reminder[0].image) {
          let params = {
            Bucket: process.env.AWS_BUCKET,
            Key: reminder[0].photo.ObjectId,
          };
          return s3DeleteProm(params);
        }
      })
      .then(() => {
        let ext = path.extname(req.file.originalname);
        let params = {
          ACL: 'public-read',
          Bucket: process.env.AWS_BUCKET,
          Key: `${req.file.filename}${ext}`,
          Body: fs.createReadStream(req.file.path),
        };
        return s3UploadProm(params)
        .then(s3Data => {
          del([`${dataDir}/*`]);
          req.body.photo = {
            imageURI: s3Data.Location,
            ObjectId: s3Data.Key,
          };
          return Reminder.findIneAndUpdate({_id:req.params.id}, req.body, {new: true});
        })
        .catch(err => Promise.reject(createError(err.status, err.message)));
      })
      .catch(err => Promise.reject(createError(err.status, err.message)));
  } else {
    return Reminder.findOneAndUpdate({_id:req.params.id}, req.body, {new: true})
      .then(reminder => reminder)
      .catch(err => Promise.reject(createError(err.status, err.message)));
  }
};

exports.deleteReminder = function(id) {
  if(!id) return Promise.reject(createError(400, 'ID required'));
  return Reminder.findById(id)
      .then(reminder => {
        if(reminder.photo) {
          let params = {
            Bucket: process.env.AWS_BUCKET,
            Key: reminder.photo.ObjectId,
          };
          s3DeleteProm(params);
        }
        return reminder;
      })
      .then(reminder => {
        return Reminder.findOneAndRemove({_id: id});
      })
      .catch( err => {
        return Promise.reject(createError(err.status, err.message));
      });
};
