const setupDatabaseConnection = require('src/database');

const userModel = require('src/database/models/user-model');
let sequelizeInstance;
beforeAll(async () => {
    sequelizeInstance = await setupDatabaseConnection();
    await sequelizeInstance.sync();
});

afterAll(async () => {
    await sequelizeInstance.close();
    console.log('db connection closed');
});

test('create user in db', async () => {
    await userModel.create({
        "firstName": "bisho",
        "lastName": "adly",
        "email": "bishoy@gmail.com",
        "password": "789"
    });
});