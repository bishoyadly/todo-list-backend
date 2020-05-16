const HttpStatus = require('http-status-codes');
const {buildRequest, buildResponse} = require('tests/utils/unit-tests-utils');
const UserController = require('src/controllers/user-controller');
const UserFactory = require('tests/utils/factories/user-factory');

test('login with an existing user', async () => {
    const request = buildRequest();
    const response = buildResponse();
    await UserController.userLogin(request, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
});