const Usuario = require("./usuarios-modelo");
const tokens = require("./tokens");
const { EmailVerificacao, EmailRedefinicaoSenha } = require("./emails");
const { ConversorUsuario } = require("../conversores");
const { InvalidArgumentError, NotFound } = require("../erros");

function geraEndereco(rota, token) {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}${rota}${token}`;
}

module.exports = {
  adiciona: async (req, res, next) => {
    const { nome, email, senha, cargo } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
        cargo,
      });

      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      const token = tokens.verificacaoEmail.cria(usuario.id);
      const endereco = geraEndereco("/usuario/verifica-email/", token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail(usuario).catch((err) => console.log(err));

      res.status(201).json();
    } catch (erro) {
      next(erro);
    }
  },

  lista: async (req, res, next) => {
    const usuarios = await Usuario.lista();

    const conversor = new ConversorUsuario(
      "json",
      req.acesso
        ? req.acesso.todos
          ? req.acesso.todos.atributos
          : req.acesso.apensasSeu.atributos
        : []
    );

    res.status(200).send(conversor.converter(usuarios));
  },

  deleta: async (req, res, next) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    console.log(usuario);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      next(erro);
    }
  },

  login: async (req, res, next) => {
    try {
      const usuario = req.user;

      if (!usuario) throw new InvalidArgumentError();

      const accesstoken = tokens.access.cria(usuario.id);
      const refreshToken = await tokens.refresh.cria(usuario.id);

      res.set("Authorization", accesstoken);

      res.status(200).json({ refreshToken });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const token = req.token;

      await tokens.access.invalida(token);
      res.status(204).end();
    } catch (err) {
      next(erro);
    }
  },

  verificaEmail: async (req, res, next) => {
    try {
      const usuario = req.user;

      await usuario.verificaEmail();
      res.status(200).end();
    } catch (err) {
      next(erro);
    }
  },

  esqueciMinhaSenha: async (req, res, next) => {
    const respostaPadrao = {
      mensagem:
        "Se encontrarmos um usuário com esse email, enviaremos uma mensagem com as instruções para redefinir a senha.",
    };

    try {
      const { email } = req.body;
      const usuario = await Usuario.buscaPorEmail(email);
      const token = await tokens.redefinicaoDeSenha.cria(usuario.id);

      console.log(usuario.email);
      const emailRedefinicaoSenha = new EmailRedefinicaoSenha(usuario, token);
      emailRedefinicaoSenha.enviaEmail();

      res.status(200).send(respostaPadrao);
    } catch (err) {
      if (err instanceof NotFound) return res.send(respostaPadrao);

      next(err);
    }
  },

  trocarSenha: async (req, res, next) => {
    try {
      const { token, senha } = req.body;

      if (typeof token !== "string" || token.length === 0)
        throw new InvalidArgumentError("Token inválido!");

      const id = await tokens.redefinicaoDeSenha.verifica(token);
      const usuario = await Usuario.buscaPorId(id);

      await usuario.adicionaSenha(senha);
      await usuario.atualizarSenha();

      res.send({ mensagem: "A senha foi atualizada com sucesso!" });
    } catch (err) {
      next(err);
    }
  },
};
