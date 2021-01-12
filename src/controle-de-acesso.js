const AccessControl = require("accesscontrol");

const ac = new AccessControl();

ac.grant("assinante")
  .readAny("post", ["id", "titulo", "conteudo", "autor"])
  .readAny("usuario", ["nome"]);

ac.grant("editor").extend("assinante").createOwn("post").deleteOwn("post");

ac.grant("admin")
  .createAny("post")
  .readAny("post")
  .deleteAny("post")
  .createAny("usuario")
  .readAny("usuario")
  .deleteAny("usuario");

module.exports = ac;
