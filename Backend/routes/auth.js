const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { validateUser, checkValidationResult } = require('../utils/validate');
const router = express.Router();

// User Signup (Normal Users)
router.post('/signup', validateUser, checkValidationResult, async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, address, 'user']
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Update Password
router.put('/update-password', auth(['user', 'store_owner', 'admin']), async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
        return res.status(400).json({ error: 'Password must be 8-16 characters, include one uppercase letter and one special character' });
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating password' });
    }
});

module.exports = router;