const bcrypt = require('bcryptjs');
const { User } = require('../models/db');
const { generateToken } = require('../config/jwt'); 

const register = async (req, res) => {
    try {
        const { email, password, role = 'user' } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error('Registration error:', error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id, user.role);

            res.json({
                success: true,
                token,
                user: { id: user._id, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
