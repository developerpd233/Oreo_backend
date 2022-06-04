const paypal = require("paypal-rest-sdk");

const Form = require("../model/form");

exports.paypalIntegration = (req, res, next) => {
  const { name, email, price, currency, description, link } = req.body;

  paypal.configure({
    mode: "sandbox",
    client_id:
      "AeTEX8t3jf_1BRGAHvZV0Sf4NbKzXwBVvN2crSs_faGagytX0zRcXM9GD8wSc2r_zHmmRwSMA7E2i70r",
    client_secret:
      "EP5WJjziwrS3mi4ZPj3ogu7wMD_cNfWrR75JxqzQaNq4ThE7Lllv4WLNBzeZWWcMAk8o6J9c1YzvQl2A",
  });

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "https://oreostudios.com",
      cancel_url: "https://oreostudios.com/admin-custom-form",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: name,
              price: price,
              currency: currency,
              quantity: "1",
            },
          ],
        },
        amount: {
          currency: currency,
          total: price,
        },
        description: description,
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      //   console.log("Create Payment Response");
      //   console.log(payment);
      //   res.send("rest");
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ url: payment.links[i].href });
        }
      }
    }
  });
};

exports.success = (req, res) => {
  const payerID = req.query.PayerID;
  const paymentID = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerID,
    transactions: [
      {
        amount: {
          currency: currency,
          total: price,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentID,
    execute_payment_json,
    function (err, payment) {
      if (err) {
        console.log(err.response);
        throw err;
      } else {
        console.log("Payment response");
        res.json({ msg: "Successfully paid ", payment: payment });
      }
    }
  );
};
