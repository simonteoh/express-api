const express = require('express');
const router = express.Router();
const { 
    getRolePermissionById, 
    updateRolePermission, 
    deleteRolePermission,
    updateRolePermissions,
    createRolePermissions
} = require('../controllers/rolePermissionController');

// Create role permissions
router.post('/', createRolePermissions);

// Get role permission by ID
router.get('/:id', getRolePermissionById);

// Update role permission
router.put('/:id', updateRolePermission);

// Delete role permission
router.delete('/:id', deleteRolePermission);

// Bulk update role permissions
router.put('/role/:id/permissions', updateRolePermissions);

module.exports = router; 