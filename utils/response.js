const response = (res, statusCode, statusValue, msg, data) => {
  res.status(statusCode).json({
    status: statusValue,
    msg,
    data,
  });
};

module.exports = { response };
