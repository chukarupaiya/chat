const { bold } = require("colors");
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    payment:{ type : Boolean},
    payment_mode:{ type: String, trim: true },
    chat_mode:{ type: String, trim: true },
    payment_type:{ type: String, trim: true },
    currency:{ type: String, trim: true },
    receiver_id:{ type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
