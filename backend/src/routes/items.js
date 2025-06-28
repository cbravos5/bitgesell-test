const express = require('express');
const { validateRequest } = require('zod-express-middleware');
const { itemValidator } = require('../validators/itemValidator');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data 
async function readData() {
  const buffer = await fsPromises.readFile(DATA_PATH);
  return JSON.parse(buffer);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();

    const { limit, q } = req.query;
    let results = data;

    if (q) {
      const lowerCaseSearch = q.toLowerCase();

      // Simple substring search
      results = results.filter(item => item.name.toLowerCase().includes(lowerCaseSearch));
    }

    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', (req, res, next) => {
  try {
    const data = readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', validateRequest({ body: itemValidator }), async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;