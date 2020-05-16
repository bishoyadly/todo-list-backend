const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
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

test('Login with user with valid credentials', async () => {
    userObj.password = await bcrypt.hash(userObj.password, 1);
    UserModel.findOne.mockImplementationOnce(() => {
        return {
            dataValues: userObj
        }
    });

    await AuthService.userLogin(request, response, next);
    expect(UserModel.findOne).toHaveBeenCalledTimes(1);
    expect(UserModel.findOne).toHaveBeenCalledWith({
        where: {
            email: credentialsObj.email,
        }
    });
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.send).toHaveBeenCalledTimes(1);
});

async function assertInvalidCredentials() {
    await AuthService.userLogin(request, response, next);
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

test('Login with user with non existing user email', async () => {
    userObj.password = await bcrypt.hash(userObj.password, 1);
    UserModel.findOne.mockImplementationOnce(() => null);

    await assertInvalidCredentials();
});

test('Login with user with wrong password', async () => {
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

    await AuthService.userLogin(request, response, next);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(expectedResponseError);
}

test('Login with user credentials without email field', async () => {
    await validateUserCredentialsRequestFields('email');
});

test('Login with user credentials without password field', async () => {
    await validateUserCredentialsRequestFields('password');
});

test('Login with user credentials without request body', async () => {
    request.body = null;
    await validateUserCredentialsRequestFields();
});


async function requestWithAccessToken(privateKey) {
    const token = jsonWebToken.sign({email: userObj.email}, privateKey);
    const authorizationHeader = `Bearer ${token}`;
    request = buildRequest({
        body: userObj,
        headers: {
            authorization: authorizationHeader
        }
    });

    await AuthService.validateAccessToken(request, response, next);
}

test('Validate Access Token for an existing user', async () => {
    UserModel.findOne.mockImplementationOnce(() => {
        return {
            dataValues: userObj
        }
    });

    await requestWithAccessToken('privateKey');
    expect(next).toHaveBeenCalledTimes(1);
});

test('Validate Access Token for a non existing user', async () => {
    UserModel.findOne.mockImplementationOnce(() => null);

    await requestWithAccessToken('privateKey');
    expect(next).toHaveBeenCalledTimes(0);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.send).toHaveBeenCalledWith(invalidCredentialsError);
});

test('Validate Access Token for different Signature', async () => {
    UserModel.findOne.mockImplementationOnce(() => null);

    await requestWithAccessToken('invalidKey');
    expect(next).toHaveBeenCalledTimes(0);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.send).toHaveBeenCalledWith(invalidCredentialsError);
});