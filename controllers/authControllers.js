const express = require('express');
const dbAuthOperations = require('../db/dbAuthOperations');

function signupPost(req, res) {
    return dbAuthOperations.insertUser(req.body)
    .then(data => {
        console.log('in controlllers', data)
        res.send('signupPost')
    })
    .catch(err => console.log(err))
}

function loginPost(req, res) {
    res.send('loginPost')
}

function logoutPost(req, res) {
    res.send('logoutPost')
}

function refreshtokenPost(req, res) {
    res.send('refresh token post')
}

module.exports = { signupPost, loginPost, logoutPost, refreshtokenPost }