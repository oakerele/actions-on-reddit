var mainFunctions = require('firebase-functions');
var mainAdmin = require('firebase-admin');
var mainMoment = require('moment');
var mainActions = require('actions-on-google');
var config = require('./config');
var snoowrap = require('snoowrap');

mainAdmin.initializeApp(mainFunctions.config().firebase);

// TODO: Set up a DEBUG environment to test locally. process.env.DEBUG
// const mainReddit = new snoowrap({
//   userAgent: 'Google Assistant App by /u/thatwolfisthetits',
//   clientId: config.reddit.id,
//   clientSecret: config.reddit.secret,
//   refreshToken: config.reddit.refresh_token,
// });

// Deploy with this
const mainReddit = new snoowrap({
  userAgent: 'Google Assistant App by /u/thatwolfisthetits',
  clientId: mainFunctions.config().reddit.id,
  clientSecret: mainFunctions.config().reddit.secret,
  refreshToken: mainFunctions.config().reddit.refresh_token
});

exports.functions = mainFunctions;
exports.admin = mainAdmin;
exports.moment = mainMoment;
exports.actions = mainActions;
exports.reddit = mainReddit;
