const Usuario = require("./usuarios-modelo");
const { InvalidArgumentError, InternalServerError } = require("../erros");
const tokens = require("./tokens");
const EmailVerificacao = require("./emails").EmailVerificacao;

function geraEndereco(rota, token) {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}${rota}${token}`;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
      });

      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      const token = tokens.verificacaoEmail.cria(usuario.id);
      const endereco = geraEndereco("/usuario/verifica-email/", token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail(usuario).catch((err) => console.log(err));

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },

  login: async (req, res) => {
    const usuario = req.user;

    const accesstoken = tokens.access.cria(usuario.id);
    const refreshToken = await tokens.refresh.cria(usuario.id);

    res.set("Authorization", accesstoken);

    res.status(200).json({ refreshToken });
  },

  logout: async (req, res) => {
    try {
      const token = req.token;

      await tokens.access.invalida(token);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  verificaEmail: async (req, res) => {
    try {
      const usuario = req.user;

      await usuario.verificaEmail();
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
