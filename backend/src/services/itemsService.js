const { writeData, readData } = require("../data/fileAccess");

const getItemsList = async (req, res, next) => {
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
}

const getItemById = async (req, res, next) => {
  try {
    const data = await readData();
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
}

const createItem = async (req, res, next) => {
  try {
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);

    writeData(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = { getItemsList, getItemById, createItem }