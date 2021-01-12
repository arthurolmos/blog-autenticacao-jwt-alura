const db = require("../../database");

module.exports = {
  adiciona: (post) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO posts (
          titulo, 
          conteudo,
          autor
        ) VALUES (?, ?, ?)
      `,
        [post.titulo, post.conteudo, post.autor],
        (erro) => {
          if (erro) {
            return reject("Erro ao adicionar o post!");
          }

          return resolve();
        }
      );
    });
  },

  lista: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM posts`, (erro, resultados) => {
        if (erro) {
          console.log(erro);
          return reject("Erro ao listar os posts!");
        }

        return resolve(resultados);
      });
    });
  },

  deleta: (post) => {
    return new Promise((resolve, reject) => {
      console.log(post.id);
      db.run(
        `
          DELETE FROM posts
          WHERE id = ?
        `,
        [post.id],
        (erro) => {
          if (erro) {
            return reject("Erro ao deletar o post");
          }
          return resolve();
        }
      );
    });
  },

  buscaPorId: (id, idAutor) => {
    let sql = `SELECT * FROM posts WHERE id = ?`;
    const params = [id];

    idAutor = Number(idAutor);
    if (isNaN(idAutor) === false) {
      sql = `${sql} AND autor = ?`;
      params.push(idAutor);
    }

    return new Promise((resolve, reject) => {
      db.get(sql, params, (erro, post) => {
        if (erro) {
          console.log(erro);
          return reject("Não foi possível encontrar o post!");
        }

        return resolve(post);
      });
    });
  },
};
