const controle = require("../controle-de-acesso");

const metodos = {
  ler: {
    todos: "readAny",
    apenasSeu: "readOwn",
  },

  criar: {
    todos: "createAny",
    apenasSeu: "createOwn",
  },

  remover: {
    todos: "deleteAny",
    apenasSeu: "deleteOwn",
  },
};

module.exports = (entidade, acao) => (req, res, next) => {
  const usuario = req.user;
  const permissoesDoCargo = controle.can(usuario.cargo);

  const acoes = metodos[acao];
  console.log(acao);
  console.log(metodos);
  console.log(acoes);
  const permissaoTodos = permissoesDoCargo[acoes.todos](entidade);
  const permissaoApenasSeu = permissoesDoCargo[acoes.apenasSeu](entidade);

  console.log(permissaoTodos);
  console.log(permissaoApenasSeu);

  if (
    permissaoTodos.granted === false &&
    permissaoApenasSeu.granted === false
  ) {
    console.log("Essa rota está bloqueada");
    return res.status(403).end();
  }

  req.acesso = {
    todos: {
      permitido: permissaoTodos.granted,
      atributos: permissaoTodos.attributes,
    },

    apenasSeu: {
      permitido: permissaoApenasSeu.granted,
      atributos: permissaoApenasSeu.attributes,
    },
  };

  next();
};
