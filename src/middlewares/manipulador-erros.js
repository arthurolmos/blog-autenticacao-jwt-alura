const { InvalidArgumentError, NotFound, Unauthorized } = require("../erros");
const { ConversorErro } = require("../conversores");
const jwt = require("jsonwebtoken");

module.exports = (err, req, res, next) => {
  let status = 500;

  const corpo = { mensagem: err.message };

  if (err instanceof InvalidArgumentError) {
    status = 400;
  }

  if (err instanceof NotFound) {
    status = 404;
  }

  if (err instanceof Unauthorized) {
    status = 401;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    status = 401;
  }

  if (err instanceof jwt.TokenExpiredError) {
    status = 401;
    corpo.expiredAt = err.expiredAt;
  }

  const conversor = new ConversorErro("json");
  res.status(status).send(conversor.converter(corpo));
};
