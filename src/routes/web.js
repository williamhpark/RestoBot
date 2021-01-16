const express = require("express");
const router = express.Router();

const homepageController = require("../controllers/homepageController");
const chatbotController = require("../controllers/chatbotController");

let initWebRoutes = (app) => {
  router.get("/", homepageController.getHomepage);
  router.get("/webhook", chatbotController.getWebhook);
  router.post("/webhook", chatbotController.postWebhook);
  router.get("/profile", homepageController.getFacebookUserProfile);
  router.post(
    "/set-up-user-fb-profile",
    homepageController.setUpUserFacebookProfile
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
