'use strict';

var shared = require('./src/shared');
var reddit = require('./src/reddit');

var actions = shared.actions;
var functions = shared.functions;

const ActionsSdkApp = actions.ActionsSdkApp;

const welcomeText = 'Welcome to Actions on Reddit! You can ask for what\'s trending on reddit ' +
  'and so much more. So what would you like me to do today?';

// Handles the initial interaction
const mainIntent = (assistant) => {
  const inputPrompt = assistant.buildInputPrompt(false, welcomeText,
    ['I can give you your notifications', 'Ask for the latest crypto prices']);
  assistant.ask(inputPrompt);
};

exports.getNotifyHome = functions.https.onRequest((req, res) => {
  const assistant = new ActionsSdkApp({ request: req, response: res });
  const actionMap = new Map();

  actionMap.set(assistant.StandardIntents.MAIN, mainIntent);

  assistant.handleRequest(actionMap);
});

Object.assign(module.exports, reddit);
