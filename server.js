require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Express API is running!');
});
// Routes - Fixed this part
app.get('/api/users', async(req, res) => {
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
        return res.json(users);
    } catch (error) {
        return res.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});