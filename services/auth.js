const jwt = require("jsonwebtoken");
const secretKey = "@5#n$mf%q*`/w";
function createTokenForUser(user) {
  const { _id,fullName, userId } = user;
  user = { _id,fullName, userId };
  console.log(user);
  return jwt.sign(user, secretKey);
}

function getUser(token) {
  return jwt.verify(token, secretKey);
}
module.exports = {
  createTokenForUser,
  getUser,
};
