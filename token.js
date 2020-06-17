const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate an Access Token for the given User Id
module.exports.generateAccessToken = (user) => {
    const token = jwt.sign({data: user}, process.env.TOKEN_SECRET);
    return token;
}