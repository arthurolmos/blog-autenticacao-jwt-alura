require("dotenv").config();
const app = require("./app");
const port = 3000;
require("./database");
require("./redis/blacklist-access-token");
require("./redis/allowlist-refresh-token");
const manipuladorErros = require("./src/middlewares/manipulador-erros");
const routes = require("./rotas");
const header = require("./src/middlewares/header");

app.use(header);
routes(app);

app.use(manipuladorErros);

app.listen(port, () => console.log(`App listening on port ${port}`));
