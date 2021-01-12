const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const DateTime = require("luxon").DateTime;
const { InvalidArgumentError } = require("../erros");
const allowlistRefreshToken = require("../../redis/allowlist-refresh-token");
const blacklistAccessToken = require("../../redis/blacklist-access-token");
const listaRedefinicaoDeSenha = require("../../redis/lista-redefinicao-de-senha");

function criaTokenJWT(id, [tempoQuantidade, tempoUnidade]) {
  const payload = { id };
  const token = jwt.sign(payload, process.env.CHAVE_JWT, {
    expiresIn: tempoQuantidade + tempoUnidade,
  });
  return token;
}

async function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], allowlist) {
  const dataExpiracao = DateTime.local()
    .plus({ [tempoUnidade]: tempoQuantidade })
    .toMillis();
  const tokenOpaco = crypto.randomBytes(24).toString("hex");

  await allowlist.adiciona(tokenOpaco, id, dataExpiracao);
  return tokenOpaco;
}

async function verificaTokenJWT(token, blacklist, nome) {
  await verificaTokenNaBlacklist(token, blacklist, nome);

  const { id } = jwt.verify(token, process.env.CHAVE_JWT);
  return id;
}

async function verificaTokenNaBlacklist(token, blacklist, nome) {
  if (!blacklist) return;

  const existe = await blacklist.contemToken(token);
  if (existe) {
    throw new jwt.JsonWebTokenError(`${nome} inválido por logout!`);
  }
}

async function verificaTokenOpaco(token, allowList, nome) {
  verificaTokenEnviado(token, nome);

  const id = await allowList.buscaValor(token);
  verificaTokenValido(id, nome);

  return id;
}

function verificaTokenValido(id, nome) {
  if (!id) throw new InvalidArgumentError(`${nome} não inválido!`);
}

function verificaTokenEnviado(token, nome) {
  if (!token) throw new InvalidArgumentError(`${nome} não enviado!`);
}

async function invalidaTokenJWT(token, blacklist) {
  await blacklist.adiciona(token);
}

async function invalidaTokenOpaco(token, allowList) {
  await allowList.deleta(token);
}

module.exports = {
  access: {
    nome: "Access token",
    lista: blacklistAccessToken,
    expiracao: [15, "minutes"],
    cria(id) {
      return criaTokenJWT(id, this.expiracao);
    },
    verifica(token) {
      return verificaTokenJWT(token, this.lista, this.nome);
    },
    invalida(token) {
      return invalidaTokenJWT(token, this.lista);
    },
  },

  refresh: {
    nome: "Refresh token",
    lista: allowlistRefreshToken,
    expiracao: [5, "days"],
    cria(id) {
      return criaTokenOpaco(id, this.expiracao, this.lista);
    },
    verifica(token) {
      return verificaTokenOpaco(token, this.lista, this.nome);
    },
    invalida(token) {
      return invalidaTokenOpaco(token, this.lista);
    },
  },

  verificacaoEmail: {
    nome: "Verificação de email token",
    expiracao: [1, "hours"],
    cria(id) {
      return criaTokenJWT(id, this.expiracao);
    },
    verifica(token) {
      return verificaTokenJWT(token, null, this.nome);
    },
  },

  redefinicaoDeSenha: {
    nome: "Redefinição de senha token",
    lista: listaRedefinicaoDeSenha,
    expiracao: [1, "hours"],
    cria(id) {
      return criaTokenOpaco(id, this.expiracao, this.lista);
    },
    verifica(token) {
      return verificaTokenOpaco(token, this.lista, this.nome);
    },
  },
};
