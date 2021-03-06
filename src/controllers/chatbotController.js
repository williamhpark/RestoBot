require("dotenv").config();
const request = require("request");
const axios = require("axios");

const chatBotService = require("../services/chatBotService");
const mainApi = require("../apis/mainApi");
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const RADAR_API_KEY = process.env.RADAR_API_KEY;
const RADAR_COOKIE = process.env.RADAR_COOKIE;
const YELP_API_KEY = process.env.YELP_API_KEY;
const testData = require("../../test");

// Wit.ai variables
const { Wit, log } = require("node-wit");
const client = new Wit({
  accessToken: process.env.WIT_TOKEN,
  logger: new log.Logger(log.DEBUG), // optional
});

// create unique code for session
// let code =
//   Math.random().toString(36).substring(2, 15) +
//   Math.random().toString(36).substring(2, 15);
// code = code.slice(0, 6).toUpperCase();
let code = "V3B4N5";

let postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Parse response with wit.ai for location directions
  client
    .message(received_message.text, {})
    .then((data) => {
      console.log("the response is " + JSON.stringify(data));
      let location1 = data.entities["wit$location:location"][0].body
        .split(" ")
        .join("+");
      let location2 = data.entities["wit$location:location"][1].body
        .split(" ")
        .join("+");

      if (location1 && !location2) {
        // Send location1 to database under current sessioncode
        callSendAPI(sender_psid, { text: "Please provide two locations" });
      } else if (location1 && location2) {
        callSendAPI(sender_psid, {
          text: `Here are your Google directions to your restaurant!\n\nhttps://www.google.ca/maps/dir/${location1}/${location2}`,
        });
      }
    })
    .catch(console.error);
}

const getYelpData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let yelpData = await mainApi.getRestaurantData(
        "Vancouver Canada",
        RADAR_API_KEY,
        RADAR_COOKIE,
        2,
        YELP_API_KEY
      );
      resolve(yelpData);
    } catch (err) {
      reject(err);
    }
  });
};

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
  let response;
  let res;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "<GET_STARTED_PAYLOAD>":
      // get username
      let username = await chatBotService.getFacebookUsername(sender_psid);

      await chatBotService.sendResponseWelcomeNewCustomer(
        username,
        sender_psid
      );
      break;
    case "ABOUT":
      response = {
        text: `RESTO-BOT helps your friends decide on a restaurant to visit with your friends. One friend creates a session and the others join that session via a unique code. Then, the session creator starts the session and everyone votes LIKE or DISLIKE on each restaurant option.`,
      };
      callSendAPI(sender_psid, response);
      // Shows buttons to create or join session
      await chatBotService.afterInfo(sender_psid);
      break;
    case "CREATE_SESSION":
      //   getYelpData()
      //     .then((result) => {
      //       console.log("RESULT: ", result);
      //       response.forEach((item) => {
      //         axios.post(`http://localhost:8080/api/restaurant/${code}`, item);
      //       });
      //     })
      //     .catch(() => {});
      //   testData.forEach((item) => {
      //     axios.post(`http://localhost:8080/api/restaurant/${code}`, item);
      //   });
      //   for (let i = 0; i < 6; i++) {
      //     await axios.post(
      //       `https://resto-bot-htn.herokuapp.com/api/restaurant/${code}`,
      //       {
      //         name: testData[i].name,
      //         location: testData[i].location.address1,
      //         rating: testData[i].rating.toString(),
      //         review_count: review_count.toString(),
      //         price: testData[i].price,
      //         image_url: testData[i].image_url,
      //         url: testData[i].url,
      //         index: i + 1,
      //       }
      //     );
      //   }
      response = { text: "What city do you want to dine at?" };
      response = {
        text: `Your code is ${code}. Share it with your friends so they can join your session too!`,
      };
      // Send message to user with the unique code
      callSendAPI(sender_psid, response);
      // Show user Start button
      await chatBotService.createResponse(sender_psid);
      break;
    case "JOIN_SESSION":
      response = { text: "Please provide your friend's session code" };
      callSendAPI(sender_psid, response);
      await chatBotService.requestCode(sender_psid);
      break;
    case "START_SESSION":
      response = { text: `Session has started. Let's go!` };
      callSendAPI(sender_psid, response);
      await chatBotService.sendRestaurant(sender_psid, 0);
      break;
    case "LIKE_1":
      await axios.post(
        `https://resto-bot-htn.herokuapp.com/api/accepted/${code}`,
        {
          index: "1",
        }
      );
      await chatBotService.sendRestaurant(sender_psid, 1);
      break;
    case "LIKE_2":
      await axios.post(
        `https://resto-bot-htn.herokuapp.com/api/accepted/${code}`,
        {
          index: "2",
        }
      );
      await chatBotService.sendRestaurant(sender_psid, 2);
      break;
    case "LIKE_3":
      await axios.post(
        `https://resto-bot-htn.herokuapp.com/api/accepted/${code}`,
        {
          index: "3",
        }
      );
      await chatBotService.sendRestaurant(sender_psid, 3);
      break;
    case "LIKE_4":
      await axios.post(
        `https://resto-bot-htn.herokuapp.com/api/accepted/${code}`,
        {
          index: "4",
        }
      );
      await chatBotService.sendRestaurant(sender_psid, 4);
      break;
    case "LIKE_5":
      await axios.post(
        `https://resto-bot-htn.herokuapp.com/api/accepted/${code}`,
        {
          index: "5",
        }
      );
      response = {
        text: `Based on your group's selections, here's the restaurant we recommend!`,
      };
      callSendAPI(sender_psid, response);

      res = await axios.get(
        `https://resto-bot-htn.herokuapp.com/api/results/${code}`
      );
      await chatBotService.sendFinalResult(sender_psid, res.data);
      break;
    case "DISLIKE_1":
      await chatBotService.sendRestaurant(sender_psid, 1);
      break;
    case "DISLIKE_2":
      await chatBotService.sendRestaurant(sender_psid, 2);
      break;
    case "DISLIKE_3":
      await chatBotService.sendRestaurant(sender_psid, 3);
      break;
    case "DISLIKE_4":
      await chatBotService.sendRestaurant(sender_psid, 4);
      break;
    case "DISLIKE_5":
      response = {
        text: `Based on your group's selections, here's the restaurant we recommend!!`,
      };
      callSendAPI(sender_psid, response);

      res = await axios.get(
        `https://resto-bot-htn.herokuapp.com/api/results/${code}`
      );
      await chatBotService.sendFinalResult(sender_psid, res.data);
      break;
    default:
      console.log("Something wrong with switch case payload");
  }
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v6.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook,
};
