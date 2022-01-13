const handleInternalServerError = (res, err) => {
  console.log('An error occurred', err);
  res.status(500);
  res.send({ message: err.message });
};
module.exports = handleInternalServerError;