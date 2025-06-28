const express = require('express');
const { validateRequest } = require('zod-express-middleware');
const { itemValidator } = require('../validators/itemValidator');
const itemsService = require('../services/itemsService');
const router = express.Router();

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const result = await itemsService.getItemsList(req.query);
  
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await itemsService.getItemById(parseInt(req.params.id));

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', validateRequest({ body: itemValidator }), async (req, res, next) => {
  try {
    const result = await itemsService.createItem(req.body);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;