const { promisify } = require("util");

module.exports = (lista) => {
  const setAsync = promisify(lista.set).bind(lista);
  const existsAsync = promisify(lista.exists).bind(lista);
  const getAsync = promisify(lista.get).bind(lista);
  const delAsync = promisify(lista.del).bind(lista);

  return {
    adiciona: async (chave, valor, dataExpiracao) => {
      await setAsync(chave, valor);
      lista.expireat(chave, dataExpiracao);
    },

    buscaValor: async (chave) => {
      return await getAsync(chave);
    },

    contemChave: async (chave) => {
      const resultado = await existsAsync(chave);
      console.log("result", resultado);
      return resultado === 1;
    },

    deleta: async (chave) => {
      await delAsync(chave);
    },
  };
};
