const cache = require("../cache");
const cacheKeys = require("../cache/keys");
const { readData } = require("../data/fileAccess");
const { mean } = require("../utils/stats");

const getStats = async () => {
  const cachedValue = cache.getKey(cacheKeys.stats);

  if (cachedValue) return cachedValue;

  const items = await readData();
    
  const priceList = items.map(({ price }) => price);

  const stats = {
    total: items.length,
    averagePrice: mean(priceList)
  };

  cache.setKey(cacheKeys.stats, stats);

  return stats;
}

module.exports = { getStats };