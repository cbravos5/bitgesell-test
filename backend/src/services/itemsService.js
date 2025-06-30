const { writeData, readData } = require("../data/fileAccess");
const eventBus = require("../events");
const events = require("../events/events");
const errorCodes = require("../middleware/errors");

// Retrieves list of items from file and apply query
const getItemsList = async (query) => {
  const data = await readData();

  const { limit = 40, page = 0, q } = query;
  let results = data;

  if (q) {
    const lowerCaseSearch = q.toLowerCase();

    // Simple substring search
    results = results.filter(item => item.name.toLowerCase().includes(lowerCaseSearch));
  }

  const skip = parseInt(page) * parseInt(limit);
  const take = (parseInt(page) + 1) * parseInt(limit);

  results = results.slice(skip, take);

  return results;
}

// Retrieves specified item by id
const getItemById = async (id) => {
  const data = await readData();

  const item = data.find(i => i.id === id);

  if (!item) {
    throw new Error(errorCodes.ITEM_NOT_FOUND.code);
  }

  return item;
}

// Create an item and write it to file
const createItem = async (item) => {
  const data = await readData();
  item.id = Date.now();
  data.push(item);

  await writeData(data);

  eventBus.emit(events.newItem)

  return item;
}

module.exports = { getItemsList, getItemById, createItem }