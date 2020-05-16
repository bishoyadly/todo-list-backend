require("tests/utils/general-utils");
const UserService = require("src/services/user-service");
const UserModel = require("src/database/models/user-model");
const UserFactory = require("tests/utils/factories/user-factory");
jest.mock("src/database/models/user-model");
test("create user with valid data", async () => {
    const userObj = UserFactory.buildUser();
    await UserService.createNewUser(userObj);
    expect(UserModel.create).toBeCalledTimes(1);
    expect(UserModel.create).toHaveBeenCalledWith(userObj);
    UserModel.create.mockClear();
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
    expect(UserModel.create).toHaveBeenCalledWith(userObj);
    expect(actualError.message).toBe('Validation error: email must be unique');
});
