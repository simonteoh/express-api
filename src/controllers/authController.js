const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with role
        const user = await prisma.users.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                firstName: true,
                lastName: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token with user role
        const token = jwt.sign(
            { 
                userId: user.id, 
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        // Set cookie with appropriate settings for both development and production
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Changed from 'none' to 'lax' for better compatibility
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            path: '/',
            // Remove domain setting as it might cause issues
        };

        // Set the cookie
        res.cookie('token', token, cookieOptions);

        // Log cookie details for debugging
        console.log("Cookie Options:", cookieOptions);
        console.log("Setting cookie for domain:", req.get('origin'));

        res.status(200).json({ 
            success: true,
            user: {
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = async (req, res) => {
    try {
        // Clear the token cookie with the same options as setting it
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/',
            // Remove domain setting as it might cause issues
        };

        res.cookie('token', '', cookieOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

module.exports = {
    login,
    logout
}; 