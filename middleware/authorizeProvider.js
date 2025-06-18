const { UnauthenticatedError } = require('../errors');

const authorizeProvider = (req, res, next) => {
    if (req.user.role !== 'provider') {
        throw new UnauthenticatedError('Only providers can perform this action');
    }
    next();
};


module.exports = authorizeProvider;
