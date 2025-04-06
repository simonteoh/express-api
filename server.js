require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const merchantRoutes = require('./src/routes/merchantRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Initialize Prisma Client
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Health check route
app.get('/', (req, res) => {
    res.send('Express API is running!');
});

// Test database connection
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ 
            status: 'error', 
            database: 'disconnected',
            error: error.message 
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/roles', roleRoutes);

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel deployment
module.exports = app;
