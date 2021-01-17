const request = require("request");
require("dotenv").config();

const testData = require("../../test");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// const testData = require("../../test");

let sendMessage = (sender_psid, response) => {
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
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

const getFacebookUsername = (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
    request(
      {
        uri: uri,
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          // convert string to json object
          body = JSON.parse(body);
          let username = `${body.first_name} ${body.last_name}`;
          resolve(username);
        } else {
          reject("Unable to send message:" + err);
        }
      }
    );
  });
};

const sendResponseWelcomeNewCustomer = (username, sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response_first = { text: `Welcome, ${username}, to RESTO-BOT` };
      let response_second = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "RESTO-BOT",
                subtitle: "Find a restaurant with friends",
                image_url: "https://i.imgur.com/jQqzkpZ.png",
                buttons: [
                  {
                    type: "postback",
                    title: "Tell me more",
                    payload: "ABOUT",
                  },
                  {
                    type: "postback",
                    title: "Create session",
                    payload: "CREATE_SESSION",
                  },
                  {
                    type: "postback",
                    title: "Join session",
                    payload: "JOIN_SESSION",
                  },
                ],
              },
            ],
          },
        },
      };
      // send a welcome message
      await sendMessage(sender_psid, response_first);

      // send an image with button view main menu
      await sendMessage(sender_psid, response_second);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

// Response to the user clicking "CREATE"
const createResponse = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Press START when they all joined.",
            buttons: [
              {
                type: "postback",
                title: "START",
                payload: "START_SESSION",
              },
            ],
          },
        },
      };
      await sendMessage(sender_psid, response);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

// Response to the user clicking "START"
const sendRestaurant = (sender_psid, count) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: testData[count].name,
                subtitle: testData[count].location.address1,
                image_url: testData[count].image_url,
                buttons: [
                  {
                    type: "postback",
                    title: "LIKE",
                    payload: `LIKE_${count + 1}`,
                  },
                  {
                    type: "postback",
                    title: "DISLIKE",
                    payload: `DISLIKE_${count + 1}`,
                  },
                ],
              },
              {
                image_url: "https://i.imgur.com/O5XuTGl.jpg",
                title: "Reviews and Price:",
                subtitle: `Rating: ${testData[count].rating}\nReviews: ${testData[count].review_count}\nPrice: ${testData[count].price}`,
              },
              {
                image_url: "https://i.imgur.com/W43smEV.jpg",
                title: "Address:",
                subtitle: `Phone: ${testData[count].display_phone}\nFull Address: ${testData[count].location.address1}\n${testData[count].location.city}\n${testData[count].location.zip_code}`,
              },
            ],
          },
        },
      };
      await sendMessage(sender_psid, response);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getFacebookUsername: getFacebookUsername,
  sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
  createResponse: createResponse,
  sendRestaurant: sendRestaurant,
};
