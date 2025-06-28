const express = require('express');
const { validateRequest } = require('zod-express-middleware');
const { itemValidator } = require('../validators/itemValidator');
const itemsService = require('../services/itemsService');
const router = express.Router();

// GET /api/items
router.get('/', itemsService.getItemsList);

// GET /api/items/:id
router.get('/:id', itemsService.getItemById);

// POST /api/items
router.post('/', validateRequest({ body: itemValidator }), itemsService.createItem);

module.exports = router;