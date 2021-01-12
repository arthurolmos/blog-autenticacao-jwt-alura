# Blog do código

> Um blog simples em Node.js.

Projeto desenvolvido durante o curso de NodeJS da Alura para o estudo de implementação de autenticação de usuários.

Autenticação:

- Utiliza o conceito de geração, refresh e invalidação de tokens JWT;
- Salva os tokens disponíveis e invalidados em uma allowlist e blocklist;
- Utiliza tempo de expiração nos tokens;

Autorização:

- Valida as permissões de acesso nas rotas privadas;
- Valida as permissões de acesso em determinadas ações;
- Serializa o retorno dos dados, podendo filtrar dados de acordo com o nível de acesso do usuário;

Email:

- Realiza o envio de email de verificação de conta;
- Realiza o envio de email de recuperação de conta;
- Realiza o envio de email ao autor do post após inserir um post;

Validações

- Valida os campos enviados nas requisições;
- Valida a senha enviada;

Segurança

- Criptografia da senha;
- Criptografia do token JWT;

Tratamento de Erros:

- Desenvolvido middleware próprio para o tratamento de erros do servidor;

Documentação:

- Documentação automática gerada pelo Esdoc;

### Tecnologias utilizadas:

- AccessControl
- Express
- Bcrypt
- JWT
- MySQL
- Nodemailer
- PassportJS (JWT Bearer, Local)
- Redis
- SQLite
- Luxon
- Nodemon
- Esdoc
- Dotenv
