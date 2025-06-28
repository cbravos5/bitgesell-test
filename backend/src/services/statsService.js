const { readData } = require("../data/fileAccess");
const { mean } = require("../utils/stats");

const getStats = async () => {
  const items = await readData();
    
  const priceList = items.map(({ price }) => price);

  const stats = {
    total: items.length,
    averagePrice: mean(priceList)
  };

  return stats;
}

module.exports = { getStats };