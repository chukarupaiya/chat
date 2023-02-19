const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const {
    content,
    chatId,
    payment,
    payment_mode,
    chat_mode,
    payment_type,
    currency,
    receiver_id,
    note,
    token_address
  } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    payment: payment,
    payment_mode: payment_mode,
    chat_mode: chat_mode,
    payment_type: payment_type,
    currency: currency,
    receiver_id:receiver_id,
    note:note,
    token_address:token_address
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const update_message = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  var myquery = { _id: messageId };
  var newvalues = { $set: { payment_mode: "pay" } };
  Message.updateOne(myquery, newvalues, function (err, res) {
    if (err) throw err;
  });
  res.json({
    "message":"updated successfully"
  })
});

module.exports = { allMessages, sendMessage ,update_message};
