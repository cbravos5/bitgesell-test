const z = require('zod');

const getItemsValidator = z.object({
  q: z.string().optional(),
  page: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => Number.isFinite(val) && val >= 0, {
      message: 'page must be a number greater than or equal to 0',
    })
    .optional(),

  limit: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => Number.isFinite(val) && val >= 1, {
      message: 'limit must be a number greater than or equal to 1',
    })
    .optional(),
});

module.exports = { getItemsValidator };