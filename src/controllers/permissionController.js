const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await prisma.permissions.findMany({
            orderBy: {
                id: 'asc',
            },
        });
        res.json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Failed to fetch permissions', details: error.message });
    }
};

const createPermissions = async (req, res) => {
    try {
        const { name, description } = req.body;

        const permission = await prisma.permissions.create({
            data: {
                name,
                description,
            },
        });

        res.status(201).json(permission);
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ error: 'Failed to create permission', details: error.message });
    }
};

// Debug: Log the functions to ensure they are defined
console.log('getAllPermissions type:', typeof getAllPermissions);
console.log('createPermissions type:', typeof createPermissions);

module.exports = {
    getAllPermissions,
    createPermissions
}; 