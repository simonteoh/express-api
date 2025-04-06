const express = require('express');
const router = express.Router();
const { 
    createUser,
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Create new user
router.post('/', createUser);

// Register new user
router.post('/register', registerUser);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router; 