const jwt = require("jsonwebtoken");

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

function authenticationMiddleware(req, res, next) {
  const authz = req.get("Authorization");
  if (authz === undefined) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authz.split(" ")[1];
  try {
    const data = verifyToken(token);
    req.auth = data;
    next();
  } catch (e) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

function authorizationMiddleware(req, res, next) {
    if (req.auth.isStaff) {
        next();
    } else {
        return res.status(403).send({ message: "Forbidden" });
    }
  };

module.exports = {authenticationMiddleware, authorizationMiddleware};
