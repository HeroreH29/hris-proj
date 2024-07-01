const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
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
      name: "HRIS Proj.",
      address: process.env.SMTP_MAIL,
    },
    to: email,
    subject: subject,
    text: message,
    attachments,
  };

  transporter.sendMail(mailOptions, function (error, info) {
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
