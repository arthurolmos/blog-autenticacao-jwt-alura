const usuariosControlador = require("./usuarios-controlador");
const middlewaresAutenticacao = require("./middlewares-autenticacao");
const autorizacao = require("../middlewares/autorizacao");

module.exports = (app) => {
  app
    .route("/usuario/esqueci-minha-senha")
    .post(usuariosControlador.esqueciMinhaSenha);

  app.route("/usuario/trocar-senha").post(usuariosControlador.trocarSenha);

  app
    .route("/usuario/atualiza-token")
    .post(middlewaresAutenticacao.refresh, usuariosControlador.login);

  app
    .route("/usuario/login")
    .post(middlewaresAutenticacao.local, usuariosControlador.login);

  //O Refresh irá invalidar o refresh token, e o bearer irá autenticar o jwt.
  //Em seguida, o logout invalida o jwt, adicionando a blacklist
  app
    .route("/usuario/logout")
    .post(
      [middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer],
      usuariosControlador.logout
    );

  app
    .route("/usuario/verifica-email/:token")
    .get(
      middlewaresAutenticacao.verificacaoEmail,
      usuariosControlador.verificaEmail
    );

  app
    .route("/usuario")
    .post(usuariosControlador.adiciona)
    .get(
      [middlewaresAutenticacao.bearer, autorizacao("usuario", "ler")],
      usuariosControlador.lista
    );

  app
    .route("/usuario/:id")
    .delete(
      [
        middlewaresAutenticacao.bearer,
        middlewaresAutenticacao.local,
        autorizacao("usuario", "remover"),
      ],
      usuariosControlador.deleta
    );
};
