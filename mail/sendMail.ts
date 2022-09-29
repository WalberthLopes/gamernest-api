const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const sendMail = async (session: any) => {
  switch (session.payment_status) {
    case "paid":
      const paidMsg = {
        to: session.customer_details.email,
        from: "contato@cubecave.net",
        subject: "COMPRA APROVADA",
        html:
          "<div>" +
          "<p><strong>Seu pagamento foi aprovado!</strong></p>" +
          `<p>Sua key: ${session.id}</p> <p>Use o comando /shopkey ${session.id} e ative seu produto!</p>` +
          "</div>",
      };

      sgMail
        .send(paidMsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error: any) => {
          console.log(error);
        });
      break;

    case "unpaid":
      const unpaidMsg = {
        to: session.customer_details.email,
        from: "contato@cubecave.net",
        subject: "COMPRA NEGADA",
        html:
          "<div>" +
          "<p><strong>Desculpe, seu pagamento foi negado!</strong></p>" +
          "<p>Sua compra foi negada pelo seu banco.</p>" +
          "<p>Seu dinheiro será estornado automaticamente em algumas horas.</p>" +
          "</div>",
      };

      sgMail
        .send(unpaidMsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error: any) => {
          console.log(error);
        });
      break;

    case "awaiting":
      const awaitingMsg = {
        to: session.customer_details.email,
        from: "contato@cubecave.net",
        subject: "COMPRA AGUARDANDO APROVAÇÃO",
        html:
          "<div>" +
          "<p><strong>Seu pagamento está sendo processado!</strong></p>" +
          "<p>Seu pagamento está sendo processado pelo seu banco.</p>" +
          "<p>Você receberá um email informando o novo status de sua compra quando ela for processada.</p>" +
          "<p>Compras realizadas com boleto podem levar de 1 a 3 dias úteis!</p>" +
          "</div>",
      };

      sgMail
        .send(awaitingMsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error: any) => {
          console.log(error);
        });
      break;
  }
};

export { sendMail };
