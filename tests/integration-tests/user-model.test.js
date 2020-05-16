require('tests/utils/integration-tests-utils');
const userModel = require("src/database/models/user-model");
const UserFactory = require("tests/utils/factories/user-factory");

async function validateUserField(field, value, expectedError) {
    const userObj = UserFactory.buildUser();
    userObj[field] = value;
    let queryError;
    try {
        await userModel.create(userObj);
    } catch (error) {
        queryError = error;
    }
    expect(queryError).not.toBe(undefined);
    expect(queryError.name).toBe("SequelizeValidationError");
    expect(queryError.message).toBe(expectedError);
}

test("create user with valid data", async () => {
    const userObj = UserFactory.buildUser();
    await userModel.create(userObj);
    const queryResult = await userModel.findOne({
        where: {
            email: userObj.email,
        },
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

test("create user with null password", async () => {
    await validateUserField("password", null, "notNull Violation: user.password cannot be null");
});

test("create two users with the same email (primary key)", async () => {
    const userObj = UserFactory.buildUser();
    let queryError;
    try {
        await userModel.create(userObj);
        await userModel.create(userObj);
    } catch (error) {
        queryError = error;
    }
    expect(queryError).not.toBe(undefined);
    expect(queryError.name).toBe('SequelizeUniqueConstraintError');
    expect(queryError.errors[0].message).toBe('email must be unique');
});
