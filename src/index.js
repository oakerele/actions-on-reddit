'use strict';

var shared = require('./shared');
var popular = require('./popular');
var subreddit = require('./subreddit');

var actions = shared.actions;
var functions = shared.functions;

const ActionsSdkApp = actions.ActionsSdkApp;

const welcomeText = 'Welcome to Sub Lurker! You can ask for what\'s trending on reddit or on a specific sub reddit ' +
  'and so much more. So what would you like me to do today?';

// Handles the initial interaction
const mainIntent = (assistant) => {
  const inputPrompt = assistant.buildInputPrompt(false, welcomeText,
    ['What\'s popular on reddit', 'Get top 5 trending posts on reddit']);
  assistant.ask(inputPrompt);
};

// Handles error catching
const catchIntent = (assistant) => {
  assistant.tell("Stay groovy!");
};

// Entry point for Actions on Reddit
exports.getRedditActions = functions.https.onRequest((req, res) => {
  const assistant = new ActionsSdkApp({ request: req, response: res });
  const actionMap = new Map();

  actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
  actionMap.set(assistant.StandardIntents.TEXT, catchIntent);

  assistant.handleRequest(actionMap);
});

Object.assign(module.exports, popular, subreddit);
