const jwt = require("jsonwebtoken");
require('dotenv').config();


module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email
    };
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};


module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token !== "undefined") {
        // Remove "Bearer " from the string
        token = token.slice(7, token.length);

        return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                return res.status(403).send({ auth: "Failed", message: err.message });
            } else {
                req.user = data; 
                next();
            }
        });
    } else {
        return res.status(401).send({ auth: "Failed", message: "No token provided" });
    }
};


module.exports.errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};