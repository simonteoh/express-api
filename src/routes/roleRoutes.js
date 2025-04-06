const express = require('express');
const router = express.Router();
const { 
    getAllRoles,
    createRole,
    getRoleById,
    updateRole,
    deleteRole
} = require('../controllers/roleController');

// Get all roles
router.get('/', getAllRoles);

// Create role
router.post('/', createRole);

// Get role by ID
router.get('/:id', getRoleById);

// Update role
router.put('/:id', updateRole);

// Delete role
router.delete('/:id', deleteRole);

module.exports = router; 