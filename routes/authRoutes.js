const express = require('express');
const router = express.Router();
const controllers = require('../controllers/authControllers')

router.post('/login', controllers.loginPost);

router.post('/signup', controllers.signupPost);

router.get('/logout', controllers.logoutPost);

//router.post('/refreshtoken', controllers.refreshTokenPost);

module.exports = router;