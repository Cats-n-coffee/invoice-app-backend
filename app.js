const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, (req, res) => {
    console.log('listening on 8080')
})