const express = require('express');
const statsService = require('../services/statsService');
const router = express.Router();

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const result = await statsService.getStats();

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;