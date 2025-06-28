const { writeData, readData } = require("../data/fileAccess");

const getItemsList = async (query) => {
  const data = await readData();

  const { limit, q } = query;
  let results = data;

  if (q) {
    const lowerCaseSearch = q.toLowerCase();

    // Simple substring search
    results = results.filter(item => item.name.toLowerCase().includes(lowerCaseSearch));
  }

  if (limit) {
    results = results.slice(0, parseInt(limit));
  }

  return results;
}

const getItemById = async (id) => {
  const data = await readData();

  const item = data.find(i => i.id === id);

  if (!item) {
    const err = new Error('Item not found');
    err.status = 404;
    throw err;
  }
}

const createItem = async (item) => {
  const data = await readData();
  item.id = Date.now();
  data.push(item);

  await writeData(data);

  return item;
}

module.exports = { getItemsList, getItemById, createItem }