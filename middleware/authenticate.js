const { config } = require('../config/config');
const { generateToken, verifyRefreshToken } = require('../helpers/accessTokens');
const jwt = require('jsonwebtoken');
const colors = require('colors');

const authenticateUser = async (req, res, next) => {
    const allCookies = req.headers.cookie;
    console.log('all cookies'.bgGreen, allCookies)
    
    if (allCookies) {
      let cookieObj = {};
      const tokenCookie = allCookies.split("; ")[0]; 
      const tokenKey = tokenCookie.split("=")[0];
      const tokenValue = tokenCookie.split('=')[1];
      cookieObj[tokenKey] = tokenValue;
      const refreshCookie = allCookies.split("; ")[1];
      const refreshTokenKey = refreshCookie.split("=")[0];
      const refreshTokenValue = refreshCookie.split("=")[1];
      cookieObj[refreshTokenKey] = refreshTokenValue;
  
      console.log('cookie obj'.bgCyan, cookieObj);

      // Verify the auth token to maintain access to protected routes
      jwt.verify(cookieObj.token, config.TOKEN_SECRET, async function (err, user) {
        if (err) {
          // Check if user has a refresh token: if they have one, carry on, otherwise return error
          const isRefreshTokenValid = await verifyRefreshToken(cookieObj.refresh_token);
          if (isRefreshTokenValid) {
            console.log('generated new token'.blue.bgYellow);
            //req.user = user;
            console.log('user'.red, req.user )
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