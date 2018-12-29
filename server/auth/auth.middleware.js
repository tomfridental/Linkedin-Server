const jwt = require('jsonwebtoken');

const false_response = {
    auth: false,
    token: null,
    message: 'You are logged out'
}

const tokenize = (id) => {
    // create a token
    const { APP_SECRET, TOKEN_EXPIRE_SECONDS } = process.env;

    return jwt.sign({ id }, APP_SECRET, {
        expiresIn: parseInt(TOKEN_EXPIRE_SECONDS) // expires in 24 hours
    })
}

const verify_token = async (req, res, next) => {
    try {
        
        // check header or url parameters or post parameters for token
        const token = req.headers['x-access-token'];

        if (!token) return res.status(403).json({
            ...false_response,
            message: 'No token provided.'
        });

        const { APP_SECRET } = process.env

        // verifies secret and checks exp
        const decoded = await jwt.verify(token, APP_SECRET)

        // if everything is good, save to request for use in other routes
        req.user_id = decoded.id;
        next();

    } catch (error) {
        return res.status(401).send({
            ...false_response,
            message: 'Unauthorized - Failed to authenticate token.'
        });
    }
}

module.exports = {
    verify_token,
    tokenize,
    false_response
};