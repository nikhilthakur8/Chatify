const express = require("express");
const userRoute = express.Router();
const User = require("../models/user");
const path = require("path");
const { createTokenForUser } = require("../services/auth");
userRoute.post("/login", async (req, res) => {
  let { userId, password } = req.body;
  userId = userId.toString().toLowerCase().trim();
  try {
    const token = await User.matchPasswordAndGenerateToken(userId, password);
    return res.cookie("uid", token).redirect("/home");
  } catch (error) {
    return res.render("login",{err:error});
  }
});
userRoute.post("/signup", async (req, res) => {
  // console.log(1);
  let { fullName, userId, password } = req.body;
  userId =  userId.toString().toLowerCase().trim();
  const newUser = await User.create({
    fullName,
    userId,
    password,
  });
  const token = createTokenForUser(newUser);
  res.cookie("uid", token).redirect("/home");
});


module.exports = userRoute;
