const express = require("express");
const {
  allMessages,
  sendMessage,
  update_message,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/update").post(update_message);
router.route("/").post(protect, sendMessage);


module.exports = router;
