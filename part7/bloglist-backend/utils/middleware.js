const logger = require('./logger')
const jwt = require("jsonwebtoken")


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

//4.20
const tokenExtractor = (request, response, next) =>  {
  // code that extracts the token
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

//4.22
const userExtractor = (request, response, next) => {
  // code that extracts the userlet token;
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET);
    request.user = decodedToken;
  }
  next();
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ "error": error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({"error": 'invalid token'})
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({"error": 'token expired'})
  }
  else if (error.message === 'jwt must be provided') {
    return response.status(401).json({ "error": 'Unauthorized' })
  }

  next(error)
}



module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}