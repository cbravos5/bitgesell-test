const { z } = require("zod");

const getItemByIdValidator = z.object({
  id: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "ID param should be a valid ID number" }
  ),
});

module.exports = { getItemByIdValidator };