const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/auth");
const { randomBytes, createHmac } = require("crypto");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    unique: true,
  },
  ConnectedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
userSchema.pre("save", function (next) {
  const user = this;
  console.log(1);
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.password = hashedPassword;
  this.salt = salt;
  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (
  userId,
  password
) {
  const user = await this.findOne({ userId });
  if (!user) throw new Error("User Not found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (hashedPassword !== userProvidedHash) {
    throw new Error("Incorrect password");
  }
  const token = createTokenForUser(user);
  return token;
};

const User = new mongoose.model("user", userSchema);

module.exports = User;
