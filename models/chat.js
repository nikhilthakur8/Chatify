const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  conversationId: {
    type: String,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  messages: [
    {
      content: {
        type: String,
        required: true,
      },
      sender: {
        type:String,
        required: true,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "user",
      },
      timestamps: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
