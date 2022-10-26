const db = require('../models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = db.users;

//signup
const signUp = async (req, res) => {
    var { email, name, password } = req.body;
    const emailAlreadyExists = await User.findOne({ where: { email } });
    if (emailAlreadyExists) {
        throw new BadRequestError('Email already exists');
    }
    const salt = await bcrypt.genSalt(10); //password hasing
    password = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password });
    res.status(StatusCodes.CREATED).json({
        user: { name: user.name },
        message: 'signup successful',
    });
};

//login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password); //compare password
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid password');
    }
    const token = jwt.sign(
        //create token
        { userId: user.id, name: user.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
    res.status(StatusCodes.OK).json({
        user: { name: user.name },
        message: 'login successful',
        token,
    });
};

module.exports = {
    signUp,
    login,
};
