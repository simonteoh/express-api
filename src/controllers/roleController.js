const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllRoles = async (req, res) => {
    try {
        const roles = await prisma.roles.findMany({
            orderBy: {
                id: 'asc',
            },
        });
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles', details: error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        
        const role = await prisma.roles.create({
            data: {
                name,
            },
        });

        res.status(201).json(role);
    } catch (error) {
        console.error('Error creating role:', error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Role already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create role', details: error.message });
        }
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await prisma.roles.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            include: {
                role_permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ error: 'Failed to fetch role', details: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { name } = req.body;

        const updatedRole = await prisma.roles.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                name,
            },
        });

        res.json(updatedRole);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Error updating role', details: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        await prisma.roles.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });

        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Error deleting role', details: error.message });
    }
};

module.exports = {
    getAllRoles,
    createRole,
    getRoleById,
    updateRole,
    deleteRole
}; 