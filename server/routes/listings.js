const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all listings (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT listings.*, users.name as seller_name 
       FROM listings 
       JOIN users ON listings.seller_id = users.id 
       WHERE listings.status = 'active'
       ORDER BY listings.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT listings.*, users.name as seller_name 
       FROM listings 
       JOIN users ON listings.seller_id = users.id 
       WHERE listings.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create listing (seller only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { animal_name, breed, age, price, description, height, temperament, location } = req.body;

    const result = await pool.query(
      `INSERT INTO listings (seller_id, animal_name, breed, age, price, description, height, temperament, location, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', NOW())
       RETURNING *`,
      [req.userId, animal_name, breed, age, price, description, height, temperament, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing (seller only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { animal_name, breed, age, price, description, height, temperament, location } = req.body;

    // Verify ownership
    const listing = await pool.query('SELECT * FROM listings WHERE id = $1', [req.params.id]);
    if (listing.rows[0].seller_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `UPDATE listings 
       SET animal_name = $1, breed = $2, age = $3, price = $4, description = $5, height = $6, temperament = $7, location = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [animal_name, breed, age, price, description, height, temperament, location, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete listing (seller only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await pool.query('SELECT * FROM listings WHERE id = $1', [req.params.id]);
    if (listing.rows[0].seller_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM listings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
