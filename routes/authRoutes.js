const express = require('express');
const router = express.Router();
const controllers = require('../controllers/authControllers')

router.post('/login', controllers.loginPost);

router.post('/signup', controllers.signupPost);

router.get('/logout', controllers.logoutPost);

module.exports = router;