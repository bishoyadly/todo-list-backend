const Sequelize = require('sequelize');
const Model = Sequelize.Model;

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
                allowNull: false
            }
        }, {
            sequelize: sequelizeInstance,
            modelName: 'user'
        });
    }
}

module.exports = UserModel;
