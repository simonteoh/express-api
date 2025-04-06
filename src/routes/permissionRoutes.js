const express = require('express');
const router = express.Router();
const { 
    getAllPermissions,
    createPermissions
} = require('../controllers/permissionController');

// Get all permissions
router.get('/', getAllPermissions);

// Create permissions
router.post('/', createPermissions);

module.exports = router; 