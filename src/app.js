const express = require('express');
const router = require('./routes');
const app = express();
app.set('port', process.env.PORT);
app.use(express.json());
app.use((request, response, next) => {
    console.log(`${request.url} ${request.method}`);
    next();
});
app.use('/api/v1', router);
const server = app.listen(app.get('port'), args => {
    console.log(`Server listend on  port ${app.get('port')}`);
});
module.exports = server;