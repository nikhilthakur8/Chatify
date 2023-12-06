const { getUser } = require("../services/auth");

async function authentication(req, res, next) {
  const token = req.cookies?.uid;
  if (!token) return next();
  const user = await getUser(token);
  req.user = user;
  next();
}

module.exports = authentication;
