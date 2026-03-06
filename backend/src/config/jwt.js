const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,   
            role: role    
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d' 
        }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = { generateToken, generateRefreshToken };
