const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const UserModel = require('src/database/models/user-model');

async function isValidData(requestEmail, requestPassword) {
    const queryResult = await UserModel.findOne({
        where: {
            email: requestEmail,
        }
    });
    if (queryResult) {
        const actualUserObj = queryResult.dataValues;
        return await bcrypt.compare(requestPassword, actualUserObj.password);
    } else {
        return false;
    }
}

function isValidRequestBody(request) {
    if (!request.body) {
        return false;
    }
    const email = request.body.email;
    const password = request.body.password;
    if (email && password) {
        return true;
    } else {
        return false;
    }
}

class AuthService {

    static async validateUserCredentials(request, response, next) {
        if (!isValidRequestBody(request)) {
            response
                .status(HttpStatus.BAD_REQUEST)
                .send('Email and Password must be provided');
            return;
        }

        const isValid = await isValidData(request.body.email, request.body.password);
        if (isValid) {
            next();
        } else {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send('Invalid User Credentials');
        }
    }
}

module.exports = AuthService;