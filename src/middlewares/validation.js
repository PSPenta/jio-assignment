const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { responseMsg } = require('../helpers/utils');

// eslint-disable-next-line consistent-return
exports.validateRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(responseMsg(errors.array()));
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMsg('Internal Server Error!'));
  }
};
