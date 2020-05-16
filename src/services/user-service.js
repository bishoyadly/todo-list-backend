const UserModel = require('src/database/models/user-model');
const bcrypt = require('bcrypt');

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

function isCapitalCharacter(character) {
    const lowerCase = character.toLowerCase();
    return lowerCase !== character;
}

function isSpecialCharacter(character) {
    const isAlphaNum = character.match(/[a-z]/) || character.match(/[A-Z]/) || character.match(/[0-9]/);
    return !isAlphaNum;
}

function isNumericCharacter(character) {
    return character.match(/[0-9]/);
}

function ValidatePassword(password) {
    let containsCapitalCharacter = false;
    let containsSpecialCharacter = false;
    let containsNumericCharacter = false;
    for (let i = 0; i < password.length; i++) {
        if (isCapitalCharacter(password[i])) {
            containsCapitalCharacter = true;
        }
        if (isSpecialCharacter(password[i])) {
            containsSpecialCharacter = true;
        }
        if (isNumericCharacter(password[i])) {
            containsNumericCharacter = true;
        }
    }
    if (!containsCapitalCharacter) {
        throw new Error('Validation error: password must contain at least one capital character');
    }
    if (!containsSpecialCharacter) {
        throw new Error('Validation error: password must contain at least one special character');
    }
    if (!containsNumericCharacter) {
        throw new Error('Validation error: password must contain at least one numeric character');
    }
}

class UserService {

    static async createNewUser(userObj) {
        const newUserObj = {...userObj};
        ValidatePassword(newUserObj.password);
        newUserObj.password = await bcrypt.hash(newUserObj.password, 1);
        try {
            await UserModel.create(newUserObj);
        } catch (error) {
            throw buildCustomError(error);
        }
    }

}

module.exports = UserService;