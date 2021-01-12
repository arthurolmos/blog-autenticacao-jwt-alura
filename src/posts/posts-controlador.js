const Post = require("./posts-modelo");
const { ConversorPost } = require("../conversores");
const { EmailNovoPost } = require("../usuarios/emails");

module.exports = {
  adiciona: async (req, res, next) => {
    try {
      const post = new Post(req.body);
      await post.adiciona();

      const autor = req.user;
      const email = new EmailNovoPost(autor, post.titulo);
      email.enviaEmail();

      res.status(201).send(post);
    } catch (erro) {
      next(erro);
    }
  },

  lista: async (req, res, next) => {
    try {
      console.log(req.acesso);
      let posts = await Post.lista();
      const conversor = new ConversorPost(
        "json",
        req.acesso
          ? req.acesso.todos.permitido
            ? req.acesso.todos.atributos
            : req.acesso.apenasSeu.atributos
          : []
      );

      if (!req.estaAutenticado) {
        posts = posts.map((post) => {
          post.conteudo =
            post.conteudo.substr(0, 10) +
            "... Você precisa assinar o blog para ler o restante do post.";

          return post;
        });
      }

      res.status(200).send(conversor.converter(posts));
    } catch (erro) {
      next(erro);
    }
  },

  remover: async (req, res, next) => {
    try {
      let post;

      if (req.acesso.todos.permitido === true) {
        post = await Post.buscaPorId(req.params.id);
      } else if (req.acesso.apenasSeu.permitido === true) {
        post = await Post.buscaPorIdAutor(req.params.id, req.user.id);
      }

      await post.deleta();
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  },

  buscaPorId: async (req, res, next) => {
    const post = await Post.buscaPorId(req.params.id);
    try {
      res.status(200).json(post);
    } catch (erro) {
      next(erro);
    }
  },
};
