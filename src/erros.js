class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);

    this.message = `Argumentos inválidos!`;
    this.name = "InvalidArgumentError";
  }
}

class InternalServerError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "InternalServerError";
  }
}

class NotFound extends Error {
  constructor(entidade) {
    super();

    this.message = `Não foi possível encontrar o ${entidade}`;
    this.name = "NotFound";
  }
}

class Unauthorized extends Error {
  constructor() {
    super();

    this.message = `Não foi possível acessar esse recurso`;
    this.name = "Unauthorized";
  }
}

module.exports = {
  InvalidArgumentError,
  InternalServerError,
  NotFound,
  Unauthorized,
};
