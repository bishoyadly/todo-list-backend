const router = require('express').Router();
const UserController = require('src/controllers/user-controller');
const AuthService = require('src/services/auth-service');
router
    .route('/users')
    .post(UserController.createUser)
    .get(AuthService.validateAccessToken, UserController.getUser);

router
    .route('/login')
    .post(AuthService.userLogin);

module.exports = router;