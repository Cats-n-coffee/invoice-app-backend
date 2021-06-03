const { config } = require('../config/config');
const { verifyToken, generateToken } = require('../helpers/accessTokens');
const jwt = require('jsonwebtoken');
const colors = require('colors');

const authenticateUser = async (req, res, next) => {
    const allCookies = req.headers.cookie;
    
    if (allCookies) {
      const tokenCookie = allCookies.split("; ")[1]; // adjust with current headers
      const token = tokenCookie.split("=")[1];
      const refreshCookie = allCookies.split("; ")[0];
      const refreshToken = refreshCookie.split("=")[1];

      // Verify the auth token to maintain access to protected routes
      jwt.verify(token, config.TOKEN_SECRET, async function (err, user) {
        if (err) {
          // Check if user has a refresh token: if they have one, carry on, otherwise return error
          const isRefreshTokenValid = await verifyToken(refreshToken);
          if (isRefreshTokenValid) {
            console.log('generated new token'.blue.bgYellow);
            req.user = user;
            const newToken = await generateToken(user.email)
            res.status(200).cookie('token', newToken, { maxAge: 18000, httpOnly: true, secure: true, sameSite: 'none' });
          }
          else {
            res.status(403).json({ error: 'auth error', message: 'Cannot authenticate token, access denied' });
            console.log("error verifying token", err);
          }
        } else {
          console.log("token verified");
          req.user = user;
          res.status(200)
        }
        next();
      });
      
    
    } else {
      res.status(403).json({ error: 'auth error', message: 'Cannot authenticate token, access denied' });
    }
 
};

module.exports = { authenticateUser }