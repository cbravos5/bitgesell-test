const z = require('zod');

const itemValidator = z.object({
  name: z.string({ required_error: "Field is required" }).max(30).min(2),
  category: z.string({ required_error: "Field is required" }).max(30).min(2),
  price: z.number({ required_error: "Field is required" }).max(10000).min(0)
});

module.exports = { itemValidator };