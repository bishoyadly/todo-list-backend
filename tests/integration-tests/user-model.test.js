const setupDatabaseConnection = require('src/database');
const userModel = require('src/database/models/user-model');
const userFactory = require('tests/utils/factories/user-factory');

let sequelizeInstance;
beforeAll(async () => {
    sequelizeInstance = await setupDatabaseConnection();
    await sequelizeInstance.sync({force: true});
});

afterAll(async () => {
    await sequelizeInstance.truncate();
    await sequelizeInstance.close();
    console.log('db connection closed');
});

async function validateUserField(field, value, expectedError) {
    const userObj = userFactory.buildUser();
    userObj[field] = value;
    let queryError;
    try {
        await userModel.create(userObj);
    } catch (error) {
        queryError = error;
    }
    expect(queryError).not.toBe(undefined);
    expect(queryError.name).toBe('SequelizeValidationError');
    expect(queryError.message).toBe(expectedError);
}

test('create user with valid data', async () => {
    const userObj = userFactory.buildUser();
    await userModel.create(userObj);
    const queryResult = await userModel.findOne({
        where: {
            email: userObj.email
        }
    });
    const actualUserObj = queryResult.dataValues;
    expect(actualUserObj.firstName).toBe(userObj.firstName);
    expect(actualUserObj.lastName).toBe(userObj.lastName);
    expect(actualUserObj.email).toBe(userObj.email);
    expect(actualUserObj.password).toBe(userObj.password);
});

test('create user with invalid firstName', async () => {
    await validateUserField('firstName', 'invalidName123', 'Validation error: Validation isAlpha on firstName failed');
});

test('create user with invalid lastName', async () => {
    await validateUserField('lastName', 'invalidName123', 'Validation error: Validation isAlpha on lastName failed');
});

test('create user with invalid email', async () => {
    await validateUserField('email', 'invalidEmail', 'Validation error: Validation isEmail on email failed');
});

test('create user with invalid password (does not contain capital character)', async () => {
    await validateUserField('password', '@12345', 'Validation error: password must contain at least one capital character');
});

test('create user with invalid password (does not contain special character)', async () => {
    await validateUserField('password', 'A12345', 'Validation error: password must contain at least one special character');
});

test('create user with invalid password (does not contain numeric character)', async () => {
    await validateUserField('password', 'A@bcd', 'Validation error: password must contain at least one numeric character');
});