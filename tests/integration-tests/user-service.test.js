const {deleteCreatedUserByEmail} = require('tests/utils/integration-tests-utils');
const bcrypt = require('bcrypt');
const UserFactory = require('tests/utils/factories/user-factory');
const UserModel = require('src/database/models/user-model');
const UserService = require('src/services/user-service');

test("user created password is encrypted", async () => {
    const userObj = UserFactory.buildUser();
    await UserService.createNewUser(userObj);
    const queryResult = await UserModel.findOne({
        where: {
            email: userObj.email,
        }
    });
    const actualUserObj = queryResult.dataValues;
    const isEqual = await bcrypt.compare(userObj.password, actualUserObj.password);
    expect(isEqual).toBe(true);
    await deleteCreatedUserByEmail(userObj.email);
});