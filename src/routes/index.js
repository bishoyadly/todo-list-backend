const router = require('express').Router();

router
    .route('/login')
    .post((request, response) => {
        response
            .status(200)
            .send('');
    });

module.exports = router;