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

module.exports = { EmailVerificacao };