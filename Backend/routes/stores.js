const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { validateUser, checkValidationResult } = require('../utils/validate');
const router = express.Router();

// Admin: Add New Store
router.post('/add', auth(['admin']), validateUser, checkValidationResult, async (req, res) => {
    const { name, email, address, owner_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, address, owner_id]
        );
        res.status(201).json({ message: 'Store added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding store' });
    }
});

// Admin: List Stores with Filters and Sorting
router.get('/', auth(['admin']), async (req, res) => {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    let query = `
        SELECT s.*, AVG(r.rating) as avg_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (name) {
        query += ` AND s.name ILIKE $${paramIndex}`;
        params.push(`%${name}%`);
        paramIndex++;
    }
    if (email) {
        query += ` AND s.email ILIKE $${paramIndex}`;
        params.push(`%${email}%`);
        paramIndex++;
    }
    if (address) {
        query += ` AND s.address ILIKE $${paramIndex}`;
        params.push(`%${address}%`);
        paramIndex++;
    }

    query += ` GROUP BY s.id ORDER BY ${sortBy} ${order}`;
    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stores' });
    }
});

// Normal User: List Stores with Search, Ratings, and Sorting
router.get('/user-stores', auth(['user']), async (req, res) => {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    let query = `
        SELECT s.*, 
               AVG(r.rating) as avg_rating,
               (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const params = [req.user.id];
    let paramIndex = 2;

    if (name) {
        query += ` AND s.name ILIKE $${paramIndex}`;
        params.push(`%${name}%`);
        paramIndex++;
    }
    if (address) {
        query += ` AND s.address ILIKE $${paramIndex}`;
        params.push(`%${address}%`);
        paramIndex++;
    }

    query += ` GROUP BY s.id ORDER BY ${sortBy} ${order}`;
    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stores' });
    }
});

module.exports = router;