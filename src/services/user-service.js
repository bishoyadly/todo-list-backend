const UserModel = require('src/database/models/user-model');

class UserService {

    static async createNewUser(userObj) {
        await UserModel.create(userObj);
    }

}

module.exports = UserService;