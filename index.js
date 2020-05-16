require('dotenv').config({path: '.env'});
require('app-module-path').addPath(__dirname);
const setupDatabaseConnection = require('./src/database');
setupDatabaseConnection();
const app = require('./src/app');
app.listen(app.get('port'), () => {
    console.log(`Server listens on  port ${app.get('port')}`);
});