import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskAPI.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setMessage('❌ Title is required');
      return;
    }
    try {
      await taskAPI.create(formData);
      setMessage('✅ Task created successfully!');
      setFormData({ title: '', description: '', status: 'pending' });
      fetchTasks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Failed to create task');
    }
  };

  const handleEdit = async (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.update(editingId, editForm);
      setMessage('✅ Task updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchTasks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      setMessage('✅ Task deleted successfully!');
      fetchTasks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Failed to delete task');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const logoutHandler = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
              <p className="text-gray-500 mt-2">{tasks.length} tasks</p>
            </div>

            <button
              onClick={logoutHandler}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className={`max-w-xl mx-auto p-4 rounded-lg border text-center font-medium ${
            message.includes('✅')
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* CREATE TASK */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Task</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title *
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>

              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task description"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="lg:col-span-3 w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Create Task
            </button>

          </form>
        </div>

        {/* TASK LIST */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              All Tasks ({tasks.length})
            </h2>

            <button
              onClick={fetchTasks}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Refresh
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No tasks found. Create your first task above.
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {tasks.map((task) => (

                <div
                  key={task._id}
                  className="p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition bg-white"
                >

                  <div className="flex justify-between items-start mb-3">

                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(task)}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  {task.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {task.status}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* EDIT MODAL */}
        {editingId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

            <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-xl">

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Task</h3>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">

                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <textarea
                  name="description"
                  rows="4"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />

                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex gap-4 pt-2">

                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                  >
                    Update Task
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;