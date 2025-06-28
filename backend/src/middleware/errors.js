// List of expected error codes
const errorCodes = {
  UNEXPECTED: {
    code: 'UNEXPECTED',
    message: "An unexpected error happened while processing your request",
    status: 500
  },
  ITEM_NOT_FOUND: {
    code: 'ITEM_NOT_FOUND',
    message: "The requested item was not found",
    status: 404
  },
}

module.exports = errorCodes;