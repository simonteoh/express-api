require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();

// Initialize Prisma Client
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Middleware
app.use(cors());
app.use(express.json());

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

app.get('/api/users', async (req, res) => {
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
        console.log("success get users");
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
});

app.get('/api/merchants', async (req, res) => {
    try {
        const merchants = await prisma.merchants.findMany();
        console.log("success get merchants");
        res.json(merchants);
    } catch (error) {
        console.error('Error fetching merchants:', error);
        res.status(500).json({ error: 'Failed to fetch merchants', details: error.message });
    }
});

app.post('/api/merchants', async (req, res) => {
    try {
        const body = await req.json();
        const { name, latitude, longitude } = body;


        const merchant = await prisma.merchants.create({
            data: {
                name,
                latitude,
                longitude
            },
        });

        return res.json(merchant, { status: 201 });
    } catch (error) {
        return res.json({ error: `Invalid request: ${error}` }, { status: 400 });
    }
})

// Remove the app.listen call as it's not needed in serverless
module.exports = app;
