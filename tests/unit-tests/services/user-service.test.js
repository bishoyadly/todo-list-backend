require('tests/utils/general-utils');
const UserService = require('src/services/user-service');
const UserModel = require('src/database/models/user-model');
jest.mock('src/database/models/user-model');
test('create user with valid data', async () => {
    const userObj = {
        firstName: 'bisho',
        lastName: 'adly',
        email: 'bisho@mail.com',
        password: '12345'
    };
    await UserService.createNewUser(userObj);
    expect(UserModel.create).toBeCalledTimes(1);
    expect(UserModel.create).toHaveBeenCalledWith(userObj);
});