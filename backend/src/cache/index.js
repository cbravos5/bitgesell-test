const _cache = new Map();

const getKey = (key) => _cache.get(key);
const setKey = (key, value) => _cache.set(key, value);
const removeKey = (key) => _cache.delete(key);

const cache = { getKey, setKey, removeKey };

module.exports = cache;