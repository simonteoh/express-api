const express = require('express');
const router = express.Router();
const { 
    getAllMerchants, 
    getMerchantById, 
    updateMerchant, 
    deleteMerchant 
} = require('../controllers/merchantController');

// Get all merchants
router.get('/', getAllMerchants);

// Get single merchant
router.get('/:id', getMerchantById);

// Update merchant
router.put('/:id', updateMerchant);

// Delete merchant
router.delete('/:id', deleteMerchant);

module.exports = router; 