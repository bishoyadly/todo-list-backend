const UserModel = require('src/database/models/user-model');

function buildCustomError(error) {
    const errorArr = error.errors;
    let customError = new Error('Validation error:');
    if (error.errors) {
        for (let i = 0; i < errorArr.length; i++) {
            customError.message += ' ' + errorArr[i].message;
        }
    }
    return customError;
}

class UserService {

    static async createNewUser(userObj) {
        try {
            await UserModel.create(userObj);
        } catch (error) {
            throw buildCustomError(error);
        }
    }

}

module.exports = UserService;