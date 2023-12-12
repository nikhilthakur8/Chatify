const express = require("express");
const User = require("../models/user");
const Chat = require("../models/chat");
const api = express.Router();
const randomstring = require("randomstring");

api.get("/user/:id", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  try {
    const userId = req.params.id.toString().toLowerCase().trim();
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User Not Found" });
    if (user.id === req.user._id) {
      return res.status(404).json({ error: "You can't message own" });
    }
    if (user && user._id != req.user._id) {
      const conversationId = randomstring.generate({
        length: 7,
        charset: "alphabetic",
      });
      try {
        const bothUserArray = [user._id,req.user._id].sort();
        const chatDoc = await Chat.findOne({
          participants: bothUserArray,
        });
        if (!chatDoc)
        await Chat.create({
          conversationId,
          participants: bothUserArray,
        });
      } catch (error) {}
      try {
        const currUser = await User.findById(req.user._id);
        const connectedUsers = currUser.ConnectedBy;
        if (!connectedUsers.includes(user._id))
          await User.findByIdAndUpdate(req.user._id, {
            $push: { ConnectedBy: user._id },
          });
        else {
          return res.status(404).json({ error: "User Already Exists" });
        }
      } catch (error) {
        console.log(error);
      }
      res.json(user);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = api;
