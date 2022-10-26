const express = require('express');
const router = express.Router();
const { bodyMiddleware } = require('../middleware/validator');
const { signUp, login } = require('../controllers/authController');

router.post('/signup', bodyMiddleware('register'), signUp);
router.post('/login', bodyMiddleware('login'), login);

module.exports = router;
