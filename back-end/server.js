'use strict';

require('dotenv').load();

const debug = require('debug');
const cors = require('cors');
const Promise = require('bluebird');
cost authRoutes = require('./routes/auth-routes');
