const { Server } = require("socket.io");
const { getUser } = require("../services/auth");
const {
  userToSocketMapping,
  checkUserOnlineOrNot,
  getConnectedUser,
  removeUser,
} = require("../services/userHandling");
const Chat = require("../models/chat");
const User = require("../models/user");

const setupSocketIO = function (server) {
  const io = new Server(server);
  io.on("connection", async (socket) => {
    const user1 = userDetailsExtractor(socket);
    const user2 = await User.findOne({
      userId: secondDetailsExtractor(socket),
    });
    const bothUserArray = [user1._id, user2.id].sort();
    let chatDoc = await Chat.findOne({ participants: bothUserArray });
    if (!chatDoc) return;
    const { conversationId } = chatDoc;
    userToSocketMapping(user1.userId, socket.id);
    socket.join(conversationId);

    socket.on("disconnect", () => {
      const disconnectUser = userDetailsExtractor(socket);
      removeUser(disconnectUser.userId);
      io.to(conversationId).emit("status", "Offline");
    });
    if (checkUserOnlineOrNot(user2.userId))
      io.to(conversationId).emit("status", "Online");
    else io.to(conversationId).emit("status", "Offline");

    socket.on("user-message", async (user, message) => {
      const user1 = userDetailsExtractor(socket);
      const user2 = await User.findOne({
        userId: secondDetailsExtractor(socket),
      });
      const bothUserArray = [user1._id, user2.id].sort();
      await Chat.findOneAndUpdate(
        { participants: bothUserArray },
        { $push: { messages: { content: message, sender: user1.userId } } }
      );

      socket.to(conversationId).emit("user-message", message);
    });
  });
};

const userDetailsExtractor = function (socket) {
  const uid = socket.handshake.headers.cookie;
  if (!uid) return undefined;
  const cookieValue = uid.split("uid=")[1];
  const user = getUser(cookieValue);
  return user;
};

const secondDetailsExtractor = function (socket) {
  const url = socket.handshake.headers.referer;
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 1];
  return id;
};
module.exports = setupSocketIO;
