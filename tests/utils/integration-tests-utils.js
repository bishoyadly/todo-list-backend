require("dotenv").config({path: ".env.test"});
const setupDatabaseConnection = require("src/database");
const UserModel = require("src/database/models/user-model");
let sequelizeInstance;
beforeAll(async () => {
    sequelizeInstance = await setupDatabaseConnection();
});

afterAll(async () => {
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

async function deleteCreatedUserByEmail(email) {
    await UserModel.destroy({
        where: {
            email: email
        }
    });
}

module.exports = {
    startServer, deleteCreatedUserByEmail
};