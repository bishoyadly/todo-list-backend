const express = require('express');
const router = require('./routes');
const app = express();
app.set('port', process.env.PORT);
app.use(express.json());
app.use((request, response, next) => {
    // console.log(`${request.method} ${request.url}`);
    next();
});
app.use('/api/v1', router);
module.exports = app;