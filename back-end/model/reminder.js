'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minderSchema = Schema({
  title: { type: String, required: true, maxlength: 100 },
  userData: {
    sender: { type: Number, required: true, minlength: 10 },
    recipient: { type: Number, required: true, minlength: 10 },
  },
  date: { type: Date, required: true },
  time : { type : Date, default: Date.now },
  description: { type: String, required: true, maxlength: 1000 },
  userId: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('minder', minderSchema);
