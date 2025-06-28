const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data 
async function readData() {
  const buffer = await fsPromises.readFile(DATA_PATH);
  return JSON.parse(buffer);
}

async function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
