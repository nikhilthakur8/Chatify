const express = require("express");
const staticRouter = express.Router();
const path = require("path");
const user = require("../models/user");
const Chat = require("../models/chat");
const User = require("../models/user");
staticRouter.get("/login", async function (req, res) {
  if (req.user) return res.redirect("/");
  return res.render("login");
});
staticRouter.get("/signup", async function (req, res) {
  if (req.user) return res.redirect("/");
  return res.render("signup");
});
staticRouter.get("/",(req,res)=>{
  res.redirect("/home");
})
staticRouter.get("/home", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const name = await user
    .findById({ _id: req.user._id })
    .populate("ConnectedBy");
  const allUser = [];
  name.ConnectedBy.forEach((user) => {
    // const chats = Chat.find({participants:[user._id,req.user._id]});
    allUser.push({
      id: user._id,
      fullName: user.fullName,
      userId: user.userId,
    });
  });
  return res.render("allchat", { allUser });
});

staticRouter.get("/chat/:userId", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const user2 = await User.findOne({ userId: req.params.userId });
  if (!user2) return  res.redirect("/home");
  const all = [req.user._id,user2.id].sort();
  const chatDoc = await Chat.findOne({participants:all});
  if(!chatDoc) return res.redirect("/home");
  const allchat = [];
  chatDoc.messages.forEach(eachChat => {
    const sender = eachChat.sender;
    const message = eachChat.content;
    allchat.push({sender,message});
  });
  // console.log(recent30chat);

  return res.render("chatHome",{user2,allchat});
});

module.exports = staticRouter;
