const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { validateRating, checkValidationResult } = require('../utils/validate');
const router = express.Router();

// Normal User: Submit or Update Rating
router.post('/:storeId', auth(['user']), validateRating, checkValidationResult, async (req, res) => {
    const { storeId } = req.params;
    const { rating } = req.body;
    try {
        const existingRating = await pool.query(
            'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
            [req.user.id, storeId]
        );
        if (existingRating.rows.length > 0) {
            // Update existing rating
            await pool.query(
                'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3',
                [rating, req.user.id, storeId]
            );
        } else {
            // Insert new rating
            await pool.query(
                'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
                [req.user.id, storeId, rating]
            );
        }
        res.json({ message: 'Rating submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting rating' });
    }
});

// Store Owner: Dashboard (Ratings and Average)
router.get('/store-owner', auth(['store_owner']), async (req, res) => {
    try {
        const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
        const store = storeResult.rows[0];
        if (!store) return res.status(404).json({ error: 'Store not found' });

        const ratingsResult = await pool.query(
            'SELECT r.rating, u.name, u.email FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = $1',
            [store.id]
        );
        const avgRatingResult = await pool.query(
            'SELECT AVG(rating) as avg_rating FROM ratings WHERE store_id = $1',
            [store.id]
        );
        res.json({
            ratings: ratingsResult.rows,
            averageRating: parseFloat(avgRatingResult.rows[0].avg_rating) || 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dashboard data' });
    }
});

module.exports = router;