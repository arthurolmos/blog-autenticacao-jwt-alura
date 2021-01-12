const nodemailer = require("nodemailer");

const configuracaoEmailTeste = (contaTeste) => ({
  host: "smtp.ethereal.email",
  auth: contaTeste,
});

//Lembrar de desativar Verificação em 2 etapas e ativar App menos Seguro no GMAIL
//Apesar disso, Gmail não é o mais indicado para isso, pois é pessoal. Procurar um provedor específico.
/*
Sendinblue
Mailgun
SendGrid
Amazon SES
Postmark
*/
const configuracaoEmailProducao = {
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
};

async function criaConfiguracaoEmail() {
  if (process.env.NODE_ENV === "production") {
    return configuracaoEmailProducao;
  } else {
    const contaTeste = await nodemailer.createTestAccount();
    return configuracaoEmailTeste(contaTeste);
  }
}

class Email {
  async enviaEmail() {
    const configEmail = await criaConfiguracaoEmail();
    const transportador = nodemailer.createTransport(configEmail);

    const info = await transportador.sendMail(this);

    if (process.env.NODE_ENV !== "production")
      console.log("URL: ", nodemailer.getTestMessageUrl(info));
  }
}

class EmailVerificacao extends Email {
  constructor(usuario, endereco) {
    super();

    this.from = '"Blog do Código" <noreply@blogcodigo.com.br>';
    this.to = usuario.email;
    this.subject = "Verificação e E-mail";
    this.text = `Olá! Verifique seu e-mail aqui: ${endereco}!`;
    this.html = `<h1>Olá!</h1> <p>Verifique seu e-mail aqui: <a href="${endereco}">${endereco}</a></p>`;
  }
}

class EmailRedefinicaoSenha extends Email {
  constructor(usuario, token) {
    super();

    this.from = '"Blog do Código" <noreply@blogcodigo.com.br>';
    this.to = usuario.email;
    this.subject = "Redefinição de senha";
    this.text = `Olá! Você pediu para redefinir sua senha. Use o token a seguir para trocar a sua senha: ${token}`;
    this.html = `<h1>Olá!</h1> <p>Olá! Você pediu para redefinir sua senha. Use o token a seguir para trocar a sua senha: ${token}</p>`;
  }
}

class EmailNovoPost extends Email {
  constructor(usuario, titulo) {
    super();

    this.from = '"Blog do Código" <noreply@blogcodigo.com.br>';
    this.to = usuario.email;
    this.subject = "Novo post criado!";
    this.text = `Olá! Seu post ${titulo} foi criado!`;
    this.html = `<h1>Olá!</h1><p>Olá! Seu post ${titulo} foi criado!</p>`;
  }
}

module.exports = { EmailVerificacao, EmailRedefinicaoSenha, EmailNovoPost };
