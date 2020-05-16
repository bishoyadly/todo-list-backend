const HttpStatus = require('http-status-codes');
const {buildRequest, buildResponse} = require('tests/utils/unit-tests-utils');
const userController = require('src/controllers/user-controller');
const UserFactory = require('tests/utils/factories/user-factory');

jest.mock('src/services/user-service');

const userService = require(`src/services/user-service`);

function getExpectedErrorMessage(fields) {
    return `Invalid request body : ${fields}, field must be provided`;
}

test('create new user with valid body', async () => {
    const userObj = UserFactory.buildUser();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.send).toHaveBeenCalledWith('');
    expect(userService.createNewUser).toHaveBeenCalledTimes(1);
    expect(userService.createNewUser).toHaveBeenCalledWith(userObj);
    userService.createNewUser.mockReset();
});

test('create new user exception case', async () => {
    let error = new Error('Validation error: Validation isAlpha on firstName failed');
    error.name = 'SequelizeValidationError';
    userService.createNewUser.mockImplementationOnce(() => {
        throw error;
    });
    const userObj = UserFactory.buildUser();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(error.message);
    expect(userService.createNewUser).toHaveBeenCalledTimes(1);
    userService.createNewUser.mockReset();
});

test('create new user with missing firstName', async () => {
    const userObj = UserFactory.buildUserMissingFirstName();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(getExpectedErrorMessage('firstName'));
});

test('create new user with missing lastName', async () => {
    const userObj = UserFactory.buildUserMissingLastName();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(getExpectedErrorMessage('lastName'));
});

test('create new user with missing email', async () => {
    const userObj = UserFactory.buildUserMissingEmail();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(getExpectedErrorMessage('email'));
});

test('create new user with missing password', async () => {
    const userObj = UserFactory.buildUserMissingPassword();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(getExpectedErrorMessage('password'));
});

test('create new user with missing email and password', async () => {
    const userObj = UserFactory.buildUserMissingEmailAndPassword();
    const request = buildRequest({body: userObj});
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(getExpectedErrorMessage(['email', 'password']));
});

test('create new user with no body', async () => {
    const request = buildRequest();
    const response = buildResponse();

    await userController.createUser(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith(getExpectedErrorMessage(['firstName', 'lastName', 'email', 'password']));
});