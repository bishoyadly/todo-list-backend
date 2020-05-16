const router = require('express').Router();
const UserController = require('src/controllers/user-controller');
router
    .route('/users')
    .post(UserController.createUser);

router
    .route('/login')
    .post((request, response) => {
        response
            .status(200)
            .send('logged in');
    });

module.exports = router;