'use strict';

var snoowrap = require('snoowrap');
var _ = require('lodash');

var shared = require('./shared');
var config = require('./config');
var actions = shared.actions;
var functions = shared.functions;

const ACTION_POPULAR = 'trending_reddit';
const ARG_NO_OF_POSTS = 'no_of_posts';
const ActionsSdkApp = actions.ActionsSdkApp;

// const reddit = new snoowrap({
//   userAgent: 'Google Assistant App by /u/thatwolfisthetits',
//   clientId: config.reddit.id,
//   clientSecret: config.reddit.secret,
//   refreshToken: config.reddit.refresh_token,
// });

const reddit = new snoowrap({
  userAgent: 'Google Assistant App by /u/thatwolfisthetits',
  clientId: functions.config().reddit.id,
  clientSecret: functions.config().reddit.secret,
  refreshToken: config.reddit.refresh_token
});

const whitelisted_sub = [
  'todayilearned', 'television', 'news', 'futurology', 'worldnews', 'environment',
  'bitcoin', 'upliftingnews', 'science', 'nottheonion', 'europe']

let popularHandler = (assistant) => {
  const noOfPosts = assistant.getArgument(ARG_NO_OF_POSTS) || 10;
  return reddit.getHot('popular', { limit: 500 })
    .then(data => data.map(data => {
      // Map the array to only return the fields below for each element
      return {
        id: data.id,
        title: data.title,
        score: data.score,
        isNSFW: data.over_18,
        gilded: data.gilded,
        timeStamp: data.created,
        url: data.url,
        subreddit: data.subreddit_name_prefixed.split('/')[1].toLowerCase()
      }
    }))
    .then(data => {
      // Filter out subreddits with content that won't be too good to say out
      return data.filter(item => {
        return whitelisted_sub.indexOf(item.subreddit) > -1;
      })
    })
    .then(data => {
      // Sort the returned data by the upvote score
      return data.sort((item1, item2) => {
        return item2.score - item1.score;
      })
    })
    .then(data => {
      // Limit the number of posts to return if the amount argument was passed in
      return data.slice(0, noOfPosts);
    })
    .then(data => {
      // Wrap the message in speak so that we can use break and say-as for a better speech synthesis
      let message = ['<speak>Here are the top posts. <break time="1000ms"/>'];
      data.forEach(item => {
        message.push(`On ${item.subreddit} with a score of <say-as interpret-as="cardinal">${Math.ceil(item.score / 100) * 100}</say-as> <break time="500ms"/>, ${item.title}.`);
      });
      message.push('<break time="1000ms"/> That is all for now!</speak>');
      return message;
    })
    .then(message => message.join(' <break time="1000ms"/> '))
    .then(message => {
      assistant.tell(message);
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getTrendingReddit = functions.https.onRequest((req, res) => {
  const assistant = new ActionsSdkApp({ request: req, response: res });

  const actionMap = new Map();
  actionMap.set(ACTION_POPULAR, popularHandler);

  assistant.handleRequest(actionMap);
  // popularHandler().then(data => {
  //   res.send(data);
  // });
});