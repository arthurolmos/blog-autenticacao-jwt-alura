const redis = require("redis");
const blacklist = redis.createClient({ prefix: "blacklist-access-token:" });
const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");
const manipulaLista = require("./manipula-lista");

function geraTokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

const manipulaBlacklist = manipulaLista(blacklist);

module.exports = {
  adiciona: async (token) => {
    const dataExpiracao = jwt.decode(token).exp;
    const tokenHash = geraTokenHash(token);
    await manipulaBlacklist.adiciona(tokenHash, "", dataExpiracao);
  },

  contemToken: async (token) => {
    const tokenHash = geraTokenHash(token);
    console.log(tokenHash);
    return manipulaBlacklist.contemChave(tokenHash);
  },
};
