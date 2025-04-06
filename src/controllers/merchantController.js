const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllMerchants = async (req, res) => {
    try {
        const merchants = await prisma.merchants.findMany();
        console.log("success get merchants");
        res.json(merchants);
    } catch (error) {
        console.error('Error fetching merchants:', error);
        res.status(500).json({ error: 'Failed to fetch merchants', details: error.message });
    }
};

const getMerchantById = async (req, res) => {
    try {
        const merchant = await prisma.merchants.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (!merchant) {
            return res.status(404).json({ error: 'Merchant not found' });
        }

        res.json(merchant);
    } catch (error) {
        console.error('Error fetching merchant:', error);
        res.status(500).json({ error: 'Error fetching merchant', details: error.message });
    }
};

const updateMerchant = async (req, res) => {
    try {
        const { name, longitude, latitude, image } = req.body;

        const updatedMerchant = await prisma.merchants.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                name,
                longitude,
                latitude,
                ...(image && { image }), // Only include image if it's provided
            },
        });

        res.json(updatedMerchant);
    } catch (error) {
        console.error('Error updating merchant:', error);
        res.status(500).json({ error: 'Error updating merchant', details: error.message });
    }
};

const deleteMerchant = async (req, res) => {
    try {
        await prisma.merchants.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });

        res.json({ message: 'Merchant deleted successfully' });
    } catch (error) {
        console.error('Error deleting merchant:', error);
        res.status(500).json({ error: 'Error deleting merchant', details: error.message });
    }
};

module.exports = {
    getAllMerchants,
    getMerchantById,
    updateMerchant,
    deleteMerchant
}; 