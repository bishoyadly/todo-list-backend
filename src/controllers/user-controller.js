const HttpStatus = require('http-status-codes');
const userService = require('src/services/user-service');

function isValidUserObj(userObj) {
    const expectedFields = ['firstName', 'lastName', 'email', 'password'];
    const actualRequestFields = Object.keys(userObj);
    let missingFieldsErrorMessage = 'Invalid request body : ';
    let valid = true;
    for (let i = 0; i < expectedFields.length; i++) {
        if (!actualRequestFields.includes(expectedFields[i])) {
            missingFieldsErrorMessage += `${expectedFields[i]},`;
            valid = false;
        }
    }
    missingFieldsErrorMessage += ' field must be provided';
    return {
        valid,
        missingFieldsErrorMessage
    };
}

class UserController {

    static async createUser(request, response) {
        const userObj = request.body;
        const {valid, missingFieldsErrorMessage} = isValidUserObj(userObj);
        if (valid) {
            try {
                await userService.createNewUser(userObj);
                response
                    .status(HttpStatus.OK)
                    .send('');

            } catch (error) {
                response
                    .status(HttpStatus.BAD_REQUEST)
                    .send(error.message);
            }

        } else {
            response
                .status(HttpStatus.BAD_REQUEST)
                .send(missingFieldsErrorMessage);
            return HttpStatus.BAD_REQUEST;
        }
    }

    static async userLogin(request, response) {
        response
            .status(HttpStatus.OK)
            .send('logged in');
    }
}

module.exports = UserController;