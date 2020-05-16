const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const UserModel = require('src/database/models/user-model');
const jsonWebToken = require('jsonwebtoken');

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

const privateKey = 'privateKey';

class AuthService {

    static async userLogin(request, response) {
        if (!isValidRequestBody(request)) {
            response
                .status(HttpStatus.BAD_REQUEST)
                .send('Email and Password must be provided');
            return;
        }

        const isValid = await isValidData(request.body.email, request.body.password);
        if (isValid) {
            const token = jsonWebToken.sign({email: request.body.email}, privateKey);
            response
                .status(HttpStatus.OK)
                .send(token);
        } else {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send('Invalid User Credentials');
        }
    }

    static async validateAccessToken(request, response, next) {
        const authorizationHeader = request.headers.authorization;
        const token = authorizationHeader.split('Bearer ')[1];
        let userEmail;
        try {
            const decoded = jsonWebToken.verify(token, privateKey);
            userEmail = decoded.email;
        } catch (error) {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send('Invalid User Credentials');
            return;
        }

        const queryResult = await UserModel.findOne({
            where: {
                email: userEmail,
            }
        });
        if (queryResult) {
            next();
        } else {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send('Invalid User Credentials');
        }
    }
}

module.exports = AuthService;