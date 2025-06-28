const eventBus = require(".");
const cache = require("../cache");
const cacheKeys = require("../cache/keys");
const events = require("./events");

eventBus.on(events.newItem, () => {
  cache.removeKey(cacheKeys.stats);
})