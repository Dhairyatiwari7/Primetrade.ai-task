const { Task } = require('../models/db');

const getTasks = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const tasks = await Task.find().sort({ createdAt: -1 }).lean();
            return res.json(tasks);
        }

        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: id };

        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }

        const task = await Task.findOne(query).lean();

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateQuery = { ...req.body };

        const query = { _id: id };
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }

        const task = await Task.findOneAndUpdate(
            query,
            updateQuery,
            { new: true, runValidators: true }
        ).lean();

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: id };

        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }

        const task = await Task.findOneAndDelete(query).lean();

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTasks, getTask, createTask, updateTask, deleteTask
};
