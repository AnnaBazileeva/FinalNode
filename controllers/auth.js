const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken');


const register= async(req, res) => {

    const user = await  User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name}, token})
}

const login = async(req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email & password')
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new UnauthenticatedError('invalid credentials')
    }

const isPasswordCorrect = await  user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('invalid credentials')
    }
    const token = jwt.sign(
        { userId: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            role: user.role,
        },
        token,
    });
}
module.exports = {
    register,
    login
}