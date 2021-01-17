const request = require("request");
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomepage = (req, res) => {
  return res.render("homepage.ejs");
};

let getFacebookUserProfile = (req, res) => {
  return res.render("profile.ejs");
};

let setUpUserFacebookProfile = (req, res) => {
  // Send the HTTP request to the Messenger Platform
  let data = {
    get_started: {
      payload: "<GET_STARTED_PAYLOAD>",
    },
    whitelisted_domains: [
      "https://messenger-restaurant-chat-bot.herokuapp.com/",
    ],
  };

  request(
    {
      uri: "https://graph.facebook.com/v6.0/me/messenger_profile",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: data,
    },
    (err, res, body) => {
      if (!err) {
        return res.status(200).json({
          message: "Setup done!",
        });
      } else {
        return res.status(500).json({
          message: "Error from the node server",
        });
      }
    }
  );

  return res.status(200).json({
    message: "OK",
  });
};

module.exports = {
  getHomepage: getHomepage,
  getFacebookUserProfile: getFacebookUserProfile,
  setUpUserFacebookProfile: setUpUserFacebookProfile,
};
