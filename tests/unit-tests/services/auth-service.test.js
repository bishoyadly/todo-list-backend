const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const {buildRequest, buildResponse, buildNext} = require('tests/utils/unit-tests-utils');
const AuthService = require('src/services/auth-service');
const UserFactory = require('tests/utils/factories/user-factory');
jest.mock('src/database/models/user-model');

const UserModel = require('src/database/models/user-model');

let userObj, credentialsObj, request, response, next;
const invalidCredentialsError = 'Invalid User Credentials';
beforeEach(() => {
    userObj = UserFactory.buildUser();
    credentialsObj = UserFactory.buildUserCredentials();
    request = buildRequest({body: credentialsObj});
    response = buildResponse();
    next = buildNext();
});

afterEach(() => {
    UserModel.findOne.mockReset();
});

test('validate user with valid credentials', async () => {
    userObj.password = await bcrypt.hash(userObj.password, 1);
    UserModel.findOne.mockImplementationOnce(() => {
        return {
            dataValues: userObj
        }
    });

    await AuthService.validateUserCredentials(request, response, next);
    expect(UserModel.findOne).toHaveBeenCalledTimes(1);
    expect(UserModel.findOne).toHaveBeenCalledWith({
        where: {
            email: credentialsObj.email,
        }
    });
    expect(next).toHaveBeenCalledTimes(1);
});

async function assertInvalidCredentials() {
    await AuthService.validateUserCredentials(request, response, next);
    expect(UserModel.findOne).toHaveBeenCalledTimes(1);
    expect(UserModel.findOne).toHaveBeenCalledWith({
        where: {
            email: credentialsObj.email,
        }
    });
    expect(next).toHaveBeenCalledTimes(0);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.send).toHaveBeenCalledWith(invalidCredentialsError);
}

test('validate user with non existing user email', async () => {
    userObj.password = await bcrypt.hash(userObj.password, 1);
    UserModel.findOne.mockImplementationOnce(() => null);

    await assertInvalidCredentials();
});

test('validate user with wrong password', async () => {
    userObj.password = await bcrypt.hash(userObj.password, 1);
    credentialsObj.password = 'invalidPassword';
    UserModel.findOne.mockImplementationOnce(() => {
        return {
            dataValues: userObj
        }
    });

    await assertInvalidCredentials();
});

async function validateUserCredentialsRequestFields(field) {
    const expectedResponseError = 'Email and Password must be provided';
    if (field) {
        delete credentialsObj[field];
    } else {
        credentialsObj = {};
    }

    await AuthService.validateUserCredentials(request, response, next);
    expect(next).toHaveBeenCalledTimes(0);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(expectedResponseError);
}

test('validate user credentials without email field', async () => {
    await validateUserCredentialsRequestFields('email');
});

test('validate user credentials without password field', async () => {
    await validateUserCredentialsRequestFields('password');
});

test('validate user credentials without request body', async () => {
    request.body = null;
    await validateUserCredentialsRequestFields();
});