'use strict';

require('./scss/main.scss');

const path = require('path');
const camelcase = require('camelcase');
const pascalcase = require('pascalcase');
const angular = require('angular');
const ngTouch = require('ngTouch');
const ngAnimate = require('ng-animate');
const ngCalendar = require('angular-bootstrap-calendar');

require('@uirouter/angularjs');
require('angular-ui-bootstrap');
require('ng-file-upload');

const clinicalAssistant = angular.module('clinicalAssistant', ['ui.router', 'ngFileUpload', 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'ngCalendar']);

let context = require.context('./config/', true, /\.js$/);
context.keys().forEach(key => clinicalAssistant.config(context(path)));

context = require.context('./view/', true, /\.js$/);
context.keys().forEach(key => clinicalAssistant.controller(pascalcase(path.basename(key, 'js')), context(key)));

context = require.context('./service/', true, /\.js$/);
context.keys().forEach(key => clinicalAssistant.service(camelcase(path.basename(key, '.js')), context(key)));

context = require.context('./component/', true, /\.js$/);
context.keys().forEach(key => clinicalAssistant.component(camelcase(path.basename(key, '.js')), context(key)));
