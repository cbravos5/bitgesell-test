const errorCodes = require('./errors');

const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
}

const errorHandler = (err, req, res, next) => {
  try {
    console.log(err);

    const error = errorCodes[err.message];

    if (!error) throw err;

    res.status(error.status).send({ error: error.message });
  } catch (globalError) {
    console.error('Unexpected error inside errorHandler:', globalError.message);
    res.status(500);
    res.json({ error: 'Unexpected' });
  }
};

module.exports = { notFound, errorHandler };