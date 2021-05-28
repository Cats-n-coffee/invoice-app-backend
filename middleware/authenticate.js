const { config } = require('../config/config');
const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    const allCookies = req.headers.cookie;
    
    if (allCookies) {
      const cookie = allCookies.split("; ")[0]; // adjust with current headers
      const token = cookie.split("=")[1];
      console.log(cookie);
  
      jwt.verify(token, config.TOKEN_SECRET, function (err, user) {
        if (err) {
          res.status(403);
          console.log("error verifying token", err);
        } else {
          console.log("token verified");
          req.user = user;
          res.status(200);
        }
        next();
      });
    } else {
      res.status(403).json({ msg: 'Cannot authenticate token, access denied' });
    }
};

module.exports = { authenticateUser }