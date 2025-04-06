const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRolePermissionById = async (req, res) => {
    try {
        const permission = await prisma.role_permissions.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            include: {
                role: true,
            },
        });

        if (!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.json(permission);
    } catch (error) {
        console.error('Error fetching permission:', error);
        res.status(500).json({ error: 'Failed to fetch permission', details: error.message });
    }
};

const updateRolePermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;

        const updatedPermission = await prisma.role_permissions.update({
            where: { id: parseInt(req.params.id) },
            data: {
                roleId,
                permissionId,
            },
        });

        res.json(updatedPermission);
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ error: 'Failed to update permission', details: error.message });
    }
};

const deleteRolePermission = async (req, res) => {
    try {
        await prisma.role_permissions.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });

        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ error: 'Failed to delete permission', details: error.message });
    }
};

const updateRolePermissions = async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        const { permissions } = req.body;

        // Delete existing permissions for this role
        await prisma.role_permissions.deleteMany({
            where: { roleId },
        });

        // Create new permissions
        const updatedPermissions = await prisma.$transaction(
            permissions.map((permissionId) =>
                prisma.role_permissions.create({
                    data: {
                        roleId,
                        permissionId,
                    },
                })
            )
        );

        res.json(updatedPermissions);
    } catch (error) {
        console.error('Failed to update permissions:', error);
        res.status(500).json({ error: 'Failed to update permissions', details: error.message });
    }
};

const createRolePermissions = async (req, res) => {
    try {
        const { roleId, permissions } = req.body;

        // Create role permissions
        const createdPermissions = await prisma.$transaction(
            permissions.map((permissionId) =>
                prisma.role_permissions.create({
                    data: {
                        roleId,
                        permissionId,
                    },
                })
            )
        );

        res.status(201).json(createdPermissions);
    } catch (error) {
        console.error('Failed to add permissions:', error);
        res.status(500).json({ error: 'Failed to add permissions', details: error.message });
    }
};

module.exports = {
    getRolePermissionById,
    updateRolePermission,
    deleteRolePermission,
    updateRolePermissions,
    createRolePermissions
}; 