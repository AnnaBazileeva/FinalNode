const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError("Authentication Invalid")
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(payload.userId).select('-password')

        if (!user) {
            throw new UnauthenticatedError('User not found')
        }
        req.user = {
            userId: user._id,
            name: user.name,
            role: user.role || 'user'
        }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth;