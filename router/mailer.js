import nodemailer from "nodemailer";

var mailer = function (mailcontent,email, callback) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dhakadkaruna99@gmail.com",
      pass: "fxeooteortbdqwww",
    },
    tls: {
      rejectUnauthorized: false, // For local development only
    },
  });

  const mailOption = {
    from: "dhakadkaruna99@gmail.com",
    to: email,
    subject: "Verification mail by express community",
    html: mailcontent
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) 
      console.log("Error while sending mail inside sendMail", error);
    else {
      console.log("Mail sent from sendMail");
      callback(info);
    }
  });
};

export default { mailer: mailer };
