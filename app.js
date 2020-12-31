const express = require("express");
const { estrategiasAutenticacao } = require("./src/usuarios");

const app = express();

app.use(express.json());

module.exports = app;
