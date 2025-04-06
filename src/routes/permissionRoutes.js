const express = require('express');
const router = express.Router();

// Import the controller functions
const permissionController = require('../controllers/permissionController');

// Debug: Log the imported functions
console.log('Imported getAllPermissions type:', typeof permissionController.getAllPermissions);
console.log('Imported createPermissions type:', typeof permissionController.createPermissions);

// Get all permissions
router.get('/', permissionController.getAllPermissions);

// Create permissions
router.post('/', permissionController.createPermissions);

module.exports = router; 