const { StatusCodes } = require('http-status-codes')
const {ValidationError} = require("joi");
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong'
  }

  if(err instanceof ValidationError) {
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode =400
  }
  if(err.code && err.code === 11000) {
    customError.msg = ` Duplicate value for  ${Object.keys(err.keyValue)}, choose another value`
    customError.statusCode = 400
  }
  if(err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode =404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
