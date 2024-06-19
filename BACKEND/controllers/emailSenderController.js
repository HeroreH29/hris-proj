const nodemailer = require("nodemailer");

// Code below is the OLD email transport. Keeping it for future references.
/* const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
}); */

const oauth2Transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.SMTP_MAIL,
    clientId: process.env.SMTP_CLIENT_ID,
    clientSecret: process.env.SMTP_CLIENT_SECRET,
    refreshToken: process.env.SMTP_REFRESH_TOKEN,
    expires: 1484314697598,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* Send leave details thru email if current user is
  from a different branch other than Head Office or Catering */
const sendLeaveThruEmail = async (req, res) => {
  const { email, subject, message, attachments } = req.body;

  var mailOptions = {
    from: {
      name: "Via Mare HRIS",
      address: process.env.SMTP_MAIL,
    },
    to: email,
    subject: subject,
    text: message,
    attachments,
  };

  oauth2Transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).json({ messsage: error });
    } else {
      console.log("Email send successfully!");
      res.json("Email sent successfully!");
    }
  });
};

module.exports = { sendLeaveThruEmail };
