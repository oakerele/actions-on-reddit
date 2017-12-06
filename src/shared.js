var mainFunctions = require('firebase-functions');
var mainAdmin = require('firebase-admin');
var mainMoment = require('moment');
var mainActions = require('actions-on-google');

mainAdmin.initializeApp(mainFunctions.config().firebase);

exports.functions = mainFunctions;
exports.admin = mainAdmin;
exports.moment = mainMoment;
exports.actions = mainActions;