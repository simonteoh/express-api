const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                created_at: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user', details: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { email, firstName, lastName, role, password } = req.body;

        const updateData = {
            email,
            firstName,
            lastName,
            role,
        };

        // Only update password if it's provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.users.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user', details: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await prisma.users.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user', details: error.message });
    }
};

module.exports = {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}; 