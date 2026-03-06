const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const initDB = async () => {
    try {
        await User.createIndexes();
        await Task.createIndexes();
        console.log('MongoDB indexes created');
    } catch (error) {
        console.error('Index creation error:', error.message);
    }
};

module.exports = { User, Task, initDB };
