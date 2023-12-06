const sessionUser = {};
const userToSocketMapping = function (user, socketId) {
  sessionUser[user] = socketId;
};
const checkUserOnlineOrNot = function (user) {
  // console.log(sessionUser)
  if (!sessionUser[user]) return 0;
  else return 1;
};
const removeUser = function (user) {
  delete sessionUser[user];
};

const getConnectedUser = function (user) {
  return sessionUser[user];
};
module.exports = {
  userToSocketMapping,
  removeUser,
  checkUserOnlineOrNot,
  getConnectedUser,
};
