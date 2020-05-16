const Sequelize = require('sequelize');
const UserModel = require('./models/user-model');
let sequelizeInstance;

function initializeDatabaseModels(sequelizeInstance) {
    UserModel.initializeUserModel(sequelizeInstance);
}

async function setupDatabaseConnection() {
    if (sequelizeInstance) {
        return sequelizeInstance;
    } else {
        sequelizeInstance = new Sequelize(process.env.DB_URL);
        try {
            await sequelizeInstance.authenticate();
            console.log('Connection has been established successfully.');
            initializeDatabaseModels(sequelizeInstance);
            // sequelizeInstance.sync({force: true})
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        return sequelizeInstance;
    }
}

module.exports = setupDatabaseConnection;