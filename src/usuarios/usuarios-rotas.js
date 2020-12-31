const usuariosControlador = require("./usuarios-controlador");
const passport = require("passport");
const middlewaresAutenticacao = require("./middlewares-autenticacao");

module.exports = (app) => {
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
    .get(usuariosControlador.lista);

  app
    .route("/usuario/:id")
    .delete(middlewaresAutenticacao.bearer, usuariosControlador.deleta);
};
