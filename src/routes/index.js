const router = require('express').Router();
const UserController = require('src/controllers/user-controller');
const AuthService = require('src/services/auth-service');
router
    .route('/users')
    .post(UserController.createUser);

router
    .route('/login')
    .post(AuthService.validateUserCredentials, UserController.userLogin);

module.exports = router;