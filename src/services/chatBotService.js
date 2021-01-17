const request = require("request");
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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
      let response_first = { text: `Welcome ${username} to RESTO-BOT` };
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
    } catch (e) {
      reject(e);
    }
  });
};

// Response to the user clicking "START"
const sendRestaurant = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "!!! RESTAURANT 1 NAME GOES HERE !!!",
                subtitle: "!!! RESTAURANT 1 DERSCRIPTION GOES HERE !!!",
                image_url: "https://bit.ly/imageToSend",
                buttons: [
                  {
                    type: "postback",
                    title: "LIKE",
                    payload: "LIKE",
                    randomKey: "randomvalue",
                  },
                  {
                    type: "postback",
                    title: "DISLIKE",
                    payload: "DISLIKE",
                    randomKey: "randomvalue",
                  },
                ],
              },
            ],
          },
        },
      };
      await sendMessage(sender_psid, response);
    } catch (e) {
      reject(e);
    }
  });
};

const sendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Our menus",
                subtitle: "We are please to offer you a wide range of menu",
                image_url: "https://bit.ly/imageToSend",
                buttons: [
                  {
                    type: "postback",
                    title: "LUNCH MENU",
                    payload: "LUNCH_MENU",
                  },
                  {
                    type: "postback",
                    title: "DINNER MENU",
                    payload: "DINNER_MENU",
                  },
                  {
                    type: "postback",
                    title: "PUB MENU",
                    payload: "PUB_MENU",
                  },
                ],
              },
              {
                title: "Hours",
                subtitle: `MON-FRI 10:00AM - 11:00PM
                SAT 5PM - 10:00 PM
                SUN 5PM - 9:00 PM
                `,
                image_url: "https://bit.ly/imageOpening",
                buttons: [
                  {
                    type: "postback",
                    title: "RESERVE A TABLE",
                    payload: "RESERVE_TABLE",
                  },
                ],
              },
              {
                title: "Banquet Rooms",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "SHOW ROOMS",
                    payload: "SHOW_ROOMS",
                  },
                ],
              },
            ],
          },
        },
      };
      // Send a welcome message
      await sendMessage(sender_psid, response);
    } catch (e) {
      reject(e);
    }
  });
};

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

module.exports = {
  getFacebookUsername: getFacebookUsername,
  sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
  sendMainMenu: sendMainMenu,
  createResponse: createResponse,
  sendRestaurant: sendRestaurant,
};
