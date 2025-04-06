const express = require('express');
const router = express.Router();
const { 
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

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