require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Express API is running!');
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
        console.log("success get users")
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/merchants', async (req, res) => {
    try {
        const merchants = await prisma.merchants.findMany({
        });
        console.log("success get merchants")
        res.json(merchants);
    } catch (error) {
        console.error('Error fetching merchants:', error);
        res.status(500).json({ error: 'Failed to fetch merchants' });
    }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
