const ContactUs = require("../model/contact");

const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   secure: true,
//   auth: {
//     user: "developerpd233@gmail.com",
//     pass: "admin@123??",
//   },
// });

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "misbahzahra12@gmail.com",
    pass: "tserosxdifysrlav",
  },
});

exports.contact = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    if (!name && !email && !phone && !subject && !message) {
      res.json({ msg: "You have to fill all the fields" });
    }
    const sendEmail = new ContactUs({
      name,
      email,
      phone,
      subject,
      message,
    });

    const savedEmail = await sendEmail.save();

    const from = email;
    const to = [email, "info@oreostudios.com"];
    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message %s sent: %s", info.messageId, info.response);
      res.json({ msg: "email sent" });
    });
    res.json({ mail: savedEmail });
  } catch (error) {
    res.json({ msg: "Something went wrong" });
  }
};

exports.getInTouch = async (req, res, next) => {
  const { name, email, phone, message } = req.body;
  try {
    if (!name && !email && !phone && !message) {
      res.json({ msg: "You have to fill all the fields" });
    }
    const sendEmail = new ContactUs({
      name,
      email,
      phone,
      message,
    });

    const savedEmail = await sendEmail.save();

    const from = "";
    const to = [email, "info@oreostudios.com"];

    let mailOptions = {
      from: from,
      to: to,
      html: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message %s sent: %s", info.messageId, info.response);
      res.json({ msg: "email sent" });
    });
    res.json({ mail: savedEmail });
  } catch (error) {
    res.json({ msg: "Something went wrong" });
  }
};
