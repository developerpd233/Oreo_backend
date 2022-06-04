const SECRET_KEY =
  "sk_test_51JMsgcCZnoNONfqxvIMdDB3nHkDO61hBwLGtg8brYiXmjJd4Hx1Cb0R5hJUWQ5YhBgaAKuoNaUfqj0rYozqVzIdD00mp1YAZk8";
const PUBLISHABLE_KEY =
  "pk_test_51JMsgcCZnoNONfqxiXwQG3gkztsE3uUTjA1wGIedA9aGDQcbQA0NLv87dgizFrgGvCNVU9ZTWtYhY9viWUgJ5rNs007iYyu4m7";

const stripe = require("stripe")(SECRET_KEY);

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "developerpd233@gmail.com",
    pass: "admin@123??",
  },
});

const Form = require("../model/form");

exports.getFormData = async (req, res) => {
  const { price, currency, description, name, email, status, link } = req.body;

  const formData = new Form({
    price,
    currency,
    description,
    name,
    email,
    link,
    status,
  });

  const savedFormData = await formData.save();

  res.json({ data: "data stored", formData: savedFormData });
};

exports.getInvoices = (req, res) => {
  const { name, email, phone, price, currency, description, id, link, status } =
    req.body;
  Form.findAll()
    .then((allInvoices) => {
      if (!allInvoices) {
        return res.json({ msg: "No Invoices found" });
      }
      res.json({ invoices: allInvoices });
    })
    .catch((err) => {
      throw new Error("Something went wrong");
    });
};

exports.payment = async (req, res) => {
  const { id, price, currency, description, name, email, status } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      name: name,
      email: email,
      amount: price,
      currency: currency,
      description: description,
      payment_method: id,
      confirm: true,
    });
    // crypto.randomBytes(32, (err, buffer) => {
    //   if (err) {
    //     res
    //       .status(500)
    //       .json({ msg: "Request cant be processed at the moment" });
    //   }
    //   const token = buffer.toString("hex");
    //   Form.findOne({ where: { id: id } }).then((result) => {
    //     const generatedLink = `http://localhost:3000/client-form/?invoiceNum=${id}/?key=${token}`;
    //     return res.send({ link: generatedLink });
    //   });
    // });

    console.log("stripe-routes.js 19 | payment", payment);
    Form.status = "Paid";
    res.json({
      message: "Payment Successful",
      success: true,
      status: status,
    });

    let from = "developerpd233@gmail.com";
    const mailOptions = {
      from: from,
      to: { email, from },
      subject: "Payment Successful",
      html: `<h4>'you have Successfully paid the given amount '</h4>
        <p>Thanks for your Purchase</p>
        `,
    };
    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        return res.json({ error: "Unable to send Email at the moment" });
      }
      res.json({ msg: "Email Sent!" });
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    Form.status = "Unpaid";
    res.json({
      message: "Payment Failed",
      success: false,
      status: status,
    });
  }
};

exports.deleteInvoice = async (req, res) => {
  const invoiceID = req.params.invoiceID;
  const invoice = await Form.findOne({ where: { id: invoiceID } });
  if (!invoice) {
    const error = new Error("Could not find invoice.");
    error.statusCode = 404;
    throw error;
  }
  await Form.destroy({ where: { id: invoiceID } });
  res.json({ msg: "successfully deleted Invoice" });
};

exports.editInvoice = async (req, res) => {
  const invoiceID = req.params.invoiceID;
  const { price, currency, description, name, email, status, link } = req.body;
  const updatedInvoice = await Form.update(
    {
      price,
      currency,
      description,
      name,
      email,
      link,
    },
    { where: { id: invoiceID } }
  );

  res.json({ msg: "Data Updated", updatedInvoice });
};
