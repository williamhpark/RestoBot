const express = require("express");
const router = express.Router();

const chatbotController = require("../controllers/chatbotController");

let initWebRoutes = (app) => {
  router.get("/", chatbotController.test);

  router.get("/webhook", chatbotController.getWebhook);
  router.post("/webhook", chatbotController.postWebhook);

  // Default value
  return app.use("/", router);
};

module.exports = initWebRoutes;
