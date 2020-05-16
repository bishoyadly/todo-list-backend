const Sequelize = require('sequelize');
const Model = Sequelize.Model;

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

function isValidPassword(password) {
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
        throw new Error('password must contain at least one capital character');
    }
    if (!containsSpecialCharacter) {
        throw new Error('password must contain at least one special character');
    }
    if (!containsNumericCharacter) {
        throw new Error('password must contain at least one numeric character');
    }
}

class UserModel extends Model {

    static initializeUserModel(sequelizeInstance) {
        UserModel.init({
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            },
            email: {
                primaryKey: true,
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    validatePassword(value) {
                        isValidPassword(value);
                    }
                }
            }
        }, {
            sequelize: sequelizeInstance,
            modelName: 'user'
        });
    }
}

module.exports = UserModel;
