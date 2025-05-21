const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { validateUser, checkValidationResult } = require('../utils/validate');
const router = express.Router();

// Admin: Add New User
router.post('/add', auth(['admin']), validateUser, checkValidationResult, async (req, res) => {
    const { name, email, password, address, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, address, role]
        );
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding user' });
    }
});

// Admin: Get Dashboard Stats
router.get('/dashboard', auth(['admin']), async (req, res) => {
    try {
        const users = await pool.query('SELECT COUNT(*) FROM users');
        const stores = await pool.query('SELECT COUNT(*) FROM stores');
        const ratings = await pool.query('SELECT COUNT(*) FROM ratings');
        res.json({
            totalUsers: parseInt(users.rows[0].count),
            totalStores: parseInt(stores.rows[0].count),
            totalRatings: parseInt(ratings.rows[0].count),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});

// Admin: List Users with Filters and Sorting
router.get('/', auth(['admin']), async (req, res) => {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (name) {
        query += ` AND name ILIKE $${paramIndex}`;
        params.push(`%${name}%`);
        paramIndex++;
    }
    if (email) {
        query += ` AND email ILIKE $${paramIndex}`;
        params.push(`%${email}%`);
        paramIndex++;
    }
    if (address) {
        query += ` AND address ILIKE $${paramIndex}`;
        params.push(`%${address}%`);
        paramIndex++;
    }
    if (role) {
        query += ` AND role = $${paramIndex}`;
        params.push(role);
        paramIndex++;
    }

    query += ` ORDER BY ${sortBy} ${order}`;
    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Admin: Get User Details
router.get('/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = userResult.rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });

        let storeRating = null;
        if (user.role === 'store_owner') {
            const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [id]);
            const store = storeResult.rows[0];
            if (store) {
                const ratingResult = await pool.query('SELECT AVG(rating) as avg_rating FROM ratings WHERE store_id = $1', [store.id]);
                storeRating = ratingResult.rows[0].avg_rating || 0;
            }
        }
        res.json({ ...user, storeRating });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user details' });
    }
});

module.exports = router;