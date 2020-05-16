require("tests/utils/unit-tests-utils");
const UserService = require("src/services/user-service");
const UserModel = require("src/database/models/user-model");
const UserFactory = require("tests/utils/factories/user-factory");
jest.mock("src/database/models/user-model");

beforeEach(() => {
    UserModel.create.mockClear();
});

test("create user with valid data", async () => {
    const userObj = UserFactory.buildUser();
    await UserService.createNewUser(userObj);
    expect(UserModel.create).toBeCalledTimes(1);
});

test("create user exception", async () => {
    let error = new Error("Validation Error");
    const primaryKeyValidationError = new Error("email must be unique");
    error.errors = [primaryKeyValidationError];
    UserModel.create.mockImplementationOnce(() => {
        throw error;
    });
    const userObj = UserFactory.buildUser();
    let actualError;

    try {
        await UserService.createNewUser(userObj);
    } catch (error) {
        actualError = error;
    }
    expect(UserModel.create).toBeCalledTimes(1);
    expect(actualError.message).toBe('Validation error: email must be unique');
});

async function validateUserField(field, value, expectedError) {
    const userObj = UserFactory.buildUser();
    userObj[field] = value;
    let serviceError;
    try {
        await UserService.createNewUser(userObj);
    } catch (error) {
        serviceError = error;
    }
    expect(UserModel.create).toBeCalledTimes(0);
    expect(serviceError).not.toBe(undefined);
    expect(serviceError.message).toBe(expectedError);
}

test('create user with invalid password (does not contain capital character)', async () => {
    await validateUserField('password', '@12345', 'Validation error: password must contain at least one capital character');
});

test('create user with invalid password (does not contain special character)', async () => {
    await validateUserField('password', 'A12345', 'Validation error: password must contain at least one special character');
});

test('create user with invalid password (does not contain numeric character)', async () => {
    await validateUserField('password', 'A@bcd', 'Validation error: password must contain at least one numeric character');
});