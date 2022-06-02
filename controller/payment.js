const uuid = require("uuid");

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

exports.payment = (req, res) => {
  const { name, email, phone, price, currency, description } = req.body;
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: price * 100,
          currency: currency,
          receipt_email: email,
          description: description,
          customer: customer.id,
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
};
