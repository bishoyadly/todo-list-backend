require("dotenv").config({path: ".env.test"});
const setupDatabaseConnection = require("src/database");
let sequelizeInstance;
beforeAll(async () => {
    sequelizeInstance = await setupDatabaseConnection();
    await sequelizeInstance.sync({force: true});
});

afterAll(async () => {
    await sequelizeInstance.truncate();
    await sequelizeInstance.close();
    console.log("db connection closed");
});

async function startServer() {
    return new Promise((resolve, reject) => {
        const server = app.listen(() => {
            resolve(server);
            console.log('Test Server listens on port ', server.address().port);
        })
    })
}

module.exports = {
    startServer
};