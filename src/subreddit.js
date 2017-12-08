'use strict';

var shared = require('./shared');
var actions = shared.actions;
var functions = shared.functions;
var reddit = shared.reddit;

const ACTION_SUBREDDIT = 'top_subreddit';
const ARG_NO_OF_POSTS = 'no_of_posts';
const ARG_SUBREDDIT = 'subreddit';
const ActionsSdkApp = actions.ActionsSdkApp;

let subredditHandler = (assistant) => {
  const noOfPosts = assistant.getArgument(ARG_NO_OF_POSTS) || 10;
  const subreddit = assistant.getArgument(ARG_SUBREDDIT) || 'all';

  return reddit.getHot(subreddit, { limit: 50 })
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
      let message = [`<speak>Here are the top ${noOfPosts} posts. <break time="1000ms"/>`];
      data.forEach(item => {
        message.push(`On ${item.subreddit} with a score of <say-as interpret-as="cardinal">${Math.ceil(item.score / 100) * 100}</say-as> <break time="500ms"/>, ${item.title}.`);
      });
      message.push('<break time="1000ms"/> That is all for now!</speak>');
      return message;
    })
    .then(message => message.join(' <break time="1400ms"/> '))
    .then(message => {
      assistant.tell(message);
    })
    .catch(err => {
      console.error(err);
      assistant.tell("Something went wrong, please try again later!");
    })
}

exports.getTopSubReddit = functions.https.onRequest((req, res) => {
  const assistant = new ActionsSdkApp({ request: req, response: res });

  const actionMap = new Map();
  actionMap.set(ACTION_SUBREDDIT, subredditHandler);

  assistant.handleRequest(actionMap);
  // subredditHandler().then(data => {
  //   res.send(data);
  // });
});