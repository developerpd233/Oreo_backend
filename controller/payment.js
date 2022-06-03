const crypto = require("crypto");

const SECRET_KEY =
  "sk_test_51JMsgcCZnoNONfqxvIMdDB3nHkDO61hBwLGtg8brYiXmjJd4Hx1Cb0R5hJUWQ5YhBgaAKuoNaUfqj0rYozqVzIdD00mp1YAZk8";
const PUBLISHABLE_KEY =
  "pk_test_51JMsgcCZnoNONfqxiXwQG3gkztsE3uUTjA1wGIedA9aGDQcbQA0NLv87dgizFrgGvCNVU9ZTWtYhY9viWUgJ5rNs007iYyu4m7";

const stripe = require("stripe")(SECRET_KEY);

const Form = require("../model/payment");

// exports.payment = async (req, res, next) => {
//   const { name, email, phone, price, currency, description } = req.body;

//   // const idempontenceyKey = uuid()

//   const form = new Form({
//     name,
//     email,
//     phone,
//     price,
//     description,
//     currency,
//   });

//   // const savedFormData = await form.save();
//   stripe.customers
//     .create({
//       email: email,
//       source: req.body.stripeToken,
//       name: name,
//       phone: phone,
//     })
//     .then((customer) => {
//       return stripe.charges.create({
//         amount: price, // Charing Rs 25
//         description: description,
//         currency: currency,
//       });
//     })
//     .then((charge) => {
//       res.send("Success"); // If no error occurs
//     })
//     .catch((err) => {
//       res.send(err); // If some error occurs
//     });
// };

exports.payment = async (req, res) => {
  const { id, price, currency, description, name, email } = req.body;
  console.log("stripe-routes.js 10 | amount and id", price, id);
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
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        res
          .status(500)
          .json({ msg: "Request cant be processed at the moment" });
      }
      const token = buffer.toString("hex");
      Form.findOne({ where: { id: id } }).then((result) => {
        const generatedLink = `http://localhost:3000/client-form/?invoiceNum=${id}/?key=${token}`;
        return res.send({ link: generatedLink });
      });
    });

    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
};

exports.getInvoices = (req, res) => {
  const { name, email, phone, price, currency, description, id } = req.body;
  Form.findAll({ where: { id } })
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
