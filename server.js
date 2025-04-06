require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const merchantRoutes = require('./src/routes/merchantRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Import middleware
const authMiddleware = require('./src/middleware/authMiddleware');

const app = express();

// Initialize Prisma Client
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

// API routes (no auth required)
app.use('/api/auth', authRoutes);

// Apply auth middleware to all routes except API routes and static files
app.use((req, res, next) => {
    // Skip middleware for API routes and static files
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/_next') || 
        req.path === '/favicon.ico') {
        return next();
    }
    authMiddleware(req, res, next);
});

// Protected routes (require auth)
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
