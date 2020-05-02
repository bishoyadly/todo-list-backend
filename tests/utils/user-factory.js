const faker = require('faker');

class UserFactory {

    static buildUser() {
        const userObj = {};
        userObj.firstName = faker.name.firstName();
        userObj.lastName = faker.name.lastName();
        userObj.email = faker.internet.email();
        userObj.password = faker.internet.password();
        return userObj;
    }

    static buildUserMissingFirstName() {
        const userObj = UserFactory.buildUser();
        delete userObj.firstName;
        return userObj;
    }

    static buildUserMissingLastName() {
        const userObj = UserFactory.buildUser();
        delete userObj.lastName;
        return userObj;
    }

    static buildUserMissingEmail() {
        const userObj = UserFactory.buildUser();
        delete userObj.email;
        return userObj;
    }

    static buildUserMissingPassword() {
        const userObj = UserFactory.buildUser();
        delete userObj.password;
        return userObj;
    }

    static buildUserMissingEmailAndPassword() {
        const userObj = UserFactory.buildUser();
        delete userObj.email;
        delete userObj.password;
        return userObj;
    }
}

module.exports = UserFactory;