const jwt = require("jsonwebtoken");
const roles = require("../utils/roles");
/// Authrization middleware
exports.isAuthorized = async (req, res, next) => {
  console.log("isAuthorized get called");
  if (!req.cookies["authorization"]) return res.status(401).redirect("/"); // in case cookie is not present redirect him to login page

  let authToken = req.cookies["authorization"];
  let token = authToken.split(" ")[1]; // take the token content
  try {
    let currentUser = await jwt.verify(token, process.env.JWT_ACCESS_KEY);

    res.user = currentUser;
    next();
  } catch (e) {
    res.clearCookie("authorization");
    return res.status(401).redirect("/");
  }
};

exports.checkUser = (supposedRole) => {
  return function (req, res, next) {
    if (res.user.role == supposedRole) {
      next();
    } else {
      // user trying to enter not correct path
      res.status(403).redirect("/");
    }
  };
};
