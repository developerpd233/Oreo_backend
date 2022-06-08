const paypal = require("paypal-rest-sdk");

const nodemailer = require("nodemailer");

const PaypalForm = require("../model/paypal");
const Form = require("../model/form");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "misbahzahra12@gmail.com",
    pass: "tserosxdifysrlav",
  },
});

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AeTEX8t3jf_1BRGAHvZV0Sf4NbKzXwBVvN2crSs_faGagytX0zRcXM9GD8wSc2r_zHmmRwSMA7E2i70r",
  client_secret:
    "EP5WJjziwrS3mi4ZPj3ogu7wMD_cNfWrR75JxqzQaNq4ThE7Lllv4WLNBzeZWWcMAk8o6J9c1YzvQl2A",
});

exports.paypalIntegration = (req, res, next) => {
  const { name, email, price, currency, description, link } = req.body;

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8080/all-invoices",
      cancel_url: "http://localhost:8080/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: name,

              price: price,
              currency: currency,
              quantity: 1,
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
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ url: payment.links[i].href });
        }
      }
    }
  });
};

// exports.success = async (req, res) => {
//   const { currency, price } = req.body;
//   const payerId = req.query.PayerID;
//   const paymentId = req.query.paymentId;

//   const execute_payment_json = {
//     payer_id: payerId,
//     transactions: [
//       {
//         amount: {
//           currency: currency,
//           total: price,
//         },
//       },
//     ],
//   };

//   paypal.payment.execute(
//     paymentId,
//     execute_payment_json,
//     function (error, payment) {
//       if (error) {
//         console.log(error.response);
//         throw error;
//       } else {
//         const updatedData = Form.update(
//           {
//             paymentId: paymentId,
//             status: "Paid",
//             createdAt: Date.now(),
//           },
//           { where: { paymentId } }
//         );
//         const saveUpdate = updatedData.save();

//         console.log(JSON.stringify(payment));
//         res.json({ msg: "Payment Successful", payerId, paymentId });
//       }
//     }
//   );
// };

exports.success = async (req, res) => {
  const { price, currency, status, create_time } = req.body;
  const id = req.query.id;
  const payerID = req.query.PayerID;
  const paymentID = req.query.paymentId;
  // const status = req.query.status;
  // const create_time = req.query.create_time;
  try {
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
          Form.update(
            {
              paymentID: paymentID,
              createdAt: create_time,
              status: "Paid",
            },
            { where: { id: id } }
          )
            .then((updateFields) => {
              console.log("Payment response");
              res.status(200).json({
                msg: "Successfully paid ",
                payment: payment,
                updateFields,
              });
            })
            .then((sendEmail) => {
              const from = "misbahzahra12@gmail.com";

              const mailOptions = {
                from: from,
                to: "misbahzahra12@gmail.com",
                html: `<div style="
                background-color: #ffffff;
                margin: 0 !important;
                padding: 0 !important;
              ">
            <div class="adM"></div>
            <div style="
                  display: none;
                  font-size: 1px;
                  color: #fefefe;
                  line-height: 1px;
                  font-family: Open Sans, Helvetica, Arial, sans-serif;
                  max-height: 0px;
                  max-width: 0px;
                  opacity: 0;
                  overflow: hidden;
                " class="adM">
              &nbsp;
            </div>
            <div class="adM"></div>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody>
                <tr>
                  <td align="center" valign="top">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                      <tbody>
                        <tr style="background-color: #100033">
                          <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="max-width: 600px">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="font-size: 0; padding-top: 20px">
                                    <div style="
                                          display: inline-block;
                                          float: left;
                                          max-width: 370px;
                                          vertical-align: top;
                                          width: 100%;
                                        ">
                                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%"
                                        style="max-width: 370px">
                                        <tbody>
                                          <tr>
                                            <td align="left" valign="top">
                                              <table width="196" align="left" cellpadding="0" cellspacing="0" border="0">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" valign="top" style="padding-bottom: 20px">
                                                      <a href="#m_7858458507392393248_" style="text-decoration: none"><img
                                                          src="https://ci5.googleusercontent.com/proxy/kReL165KLumPkp_4aeq9YiVzwiqoJ1PxsktchDMVsbmpMt4TAWC6pe9l6UiIajN5VZjXAch8u4mcuhq-4N9OZF-nQJdPDnhZm_4n9UqLW2rAv4hBiFFL=s0-d-e1-ft#https://pearpixels.com/wp-content/uploads/2021/08/logo_optimized.png"
                                                          width="170" height="" alt="Pearpixels" border="0" style="
                                                              display: block;
                                                              font-size: 18px;
                                                              line-height: 22px;
                                                              color: #76798a;
                                                              font-weight: bold;
                                                            " class="CToWUd" /></a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
        
                                    <div style="
                                          display: inline-block;
                                          float: right;
                                          max-width: 180px;
                                          vertical-align: top;
                                          width: 100%;
                                          text-align: left;
                                        ">
                                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%"
                                        style="max-width: 180px">
                                        <tbody>
                                          <tr>
                                            <td align="left" valign="top">
                                              <table width="160" align="left" cellpadding="0" cellspacing="0" border="0">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" valign="top" style="padding-bottom: 20px">
                                                      <table width="100%" align="center" cellpadding="0" cellspacing="0"
                                                        border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td align="right" style="
                                                                  font-size: 16px;
                                                                  line-height: 20px;
                                                                  color: #fff;
                                                                  font-weight: 300;
                                                                  padding-bottom: 5px;
                                                                ">
                                                              <span>CONTACT US</span>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td align="right" style="
                                                                  font-size: 15px;
                                                                  line-height: 18px;
                                                                  color: #b71d68;
                                                                  font-weight: bold;
                                                                ">
                                                              <span><a href="tel:+16693066163" style="
                                                                      text-decoration: none;
                                                                      color: #b71d68;
                                                                    " target="_blank">US
                                                                  +1(669)306-6163</a></span>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top" bgcolor="#fafafa">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="max-width: 580px">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding: 40px 10px">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="
                                                padding-bottom: 35px;
                                                font-size: 30px;
                                                line-height: 60px;
                                                color: #b71d68;
                                                font-weight: bold;
                                              ">
                                            <span>Thank you for your order</span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="
                                                padding-bottom: 15px;
                                                font-size: 25px;
                                                line-height: 30px;
                                                color: #98999b;
                                                font-weight: bold;
                                              ">
                                            <span>${name}</span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="
                                                padding-bottom: 0px;
                                                padding-top: 20px;
                                                font-size: 22px;
                                                line-height: 30px;
                                                color: #98999b;
                                                font-weight: 300;
                                              ">
                                            <span>Order ID: ${paymentID}</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top" bgcolor="#fafafa">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="90%"
                              style="max-width: 480px">
                              <tbody>
                                <tr>
                                  <td align="left" width="40%" style="
                                        padding-bottom: 0px;
                                        padding-top: 20px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #98999b;
                                        font-weight: 300;
                                      ">
                                    <span><strong>Price</strong></span>
                                  </td>
                                  <td align="left" width="55%" style="
                                        padding-bottom: 0px;
                                        padding-top: 20px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #98999b;
                                        font-weight: 300;
                                      ">
                                    <span>$ ${price}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="left" width="40%" style="
                                        padding-bottom: 0px;
                                        padding-top: 0px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #98999b;
                                        font-weight: 300;
                                      ">
                                    <span><strong>Project Detail</strong></span>
                                  </td>
                                  <td align="left" width="55%" style="
                                        padding-bottom: 0px;
                                        padding-top: 0px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #98999b;
                                        font-weight: 300;
                                      ">
                                    <span>Business Name: </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="left" width="40%" style="
                                        padding-bottom: 0px;
                                        padding-top: 0px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #98999b;
                                        font-weight: 300;
                                      ">
                                    <span><strong>Brief</strong></span>
                                  </td>
                                  <td align="left" width="55%" style="
                                        padding-bottom: 0px;
                                        padding-top: 0px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #98999b;
                                        font-weight: 300;
                                      ">
                                    <span>${description}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top" bgcolor="#fafafa">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="max-width: 580px">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding: 40px 10px">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                      <!-- <a href=""
                                          ><button
                                            style="
                                              padding: 5px 15px;
                                              background-color: #b71d68;
                                              color: white;
                                              border: 1px solid #c73a7e;
                                              border-radius: 5px;
                                              font-size: 20px;
                                            "
                                          >
                                            Pay Now
                                          </button></a
                                        > -->
                                      <tbody>
                                        <tr>
                                          <td align="center" style="
                                                padding-bottom: 20px;
                                                padding-top: 20px;
                                                font-size: 22px;
                                                line-height: 30px;
                                                color: #98999b;
                                                font-weight: 300;
                                              ">
                                            <span>This is a confirmation receipt of your
                                              Order. You will also receive a call or
                                              an email by our Accounts Management team
                                              who will be actively catering all your
                                              design needs.</span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="
                                                padding-bottom: 20px;
                                                padding-top: 20px;
                                                font-size: 22px;
                                                line-height: 30px;
                                                color: #98999b;
                                                font-weight: 300;
                                              ">
                                            <span>For any query or concern, feel free to
                                              contact us.</span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" valign="top" style="
                                                padding-bottom: 0px;
                                                font-size: 35px;
                                                color: #c91e71;
                                                font-weight: bold;
                                                text-decoration: none;
                                              ">
                                            <a style="
                                                  color: #c91e71;
                                                  text-decoration: none;
                                                " href="tel:+16693066163" target="_blank">US +1(669)306-6163</a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top" bgcolor="#333333">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="max-width: 600px">
                              <tbody>
                                <tr style="background-color: #100033">
                                  <td align="center" valign="top" style="padding: 30px 15px">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="top" style="padding-bottom: 15px">
                                            <table align="center" cellpadding="0" cellspacing="0" border="0">
                                              <tbody>
                                                <tr>
                                                  <td align="center" valign="top">
                                                    <a href="https://www.facebook.com/PearPixels/" style="text-decoration: none"
                                                      target="_blank"
                                                      data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/PearPixels/&amp;source=gmail&amp;ust=1653748262290000&amp;usg=AOvVaw1cD2zI0-hT-VEDbvwXn4g9">
                                                      <img
                                                        src="https://ci3.googleusercontent.com/proxy/KTJz5p6ckOTgvgeQccFgKpAAEjqA6SB4hxkopwmKAyWloWyEiD4JbqCCXfD6x8me7BH0zcvZPaAa3zkn3nLreQjhQF-bWOTj48RZMJwLT-qoscxfO1gNJUeoW4Ldd4jl=s0-d-e1-ft#https://pearpixels.com/wp-content/uploads/2021/09/Icon-awesome-facebook-f.png"
                                                        style="
                                                            display: block;
                                                            font-size: 9px;
                                                            width: max-content;
                                                            line-height: 22px;
                                                            color: #ffffff;
                                                          " class="CToWUd" />
                                                    </a>
                                                  </td>
                                                  <td width="9">&nbsp;</td>
                                                  <td align="center" valign="top">
                                                    <a href="https://www.linkedin.com/in/pear-pixels-29a023220/"
                                                      style="text-decoration: none" target="_blank"
                                                      data-saferedirecturl="https://www.google.com/url?q=https://www.linkedin.com/in/pear-pixels-29a023220/&amp;source=gmail&amp;ust=1653748262290000&amp;usg=AOvVaw0OKxR6mETY9TY3g-oZ-p82"><img
                                                        src="https://ci5.googleusercontent.com/proxy/j8HTuiMQFw3MsuaA93u7UBWQhlqRdrGmbbLExQE1Ok4xyuNlU3zqgQ4OUDuv_OdmKCVnCasAnStJSGTv8VkuCn0UbdfBsk9U2rR3No8E9QB7UTSI1YSOzQUDcg5arOKMdQ=s0-d-e1-ft#https://pearpixels.com/wp-content/uploads/2021/09/Icon-awesome-linkedin-in.png"
                                                        style="
                                                            display: block;
                                                            font-size: 9px;
                                                            width: max-content;
                                                            line-height: 22px;
                                                            color: #ffffff;
                                                          " class="CToWUd" /></a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="
                                                font-size: 13px;
                                                line-height: 22px;
                                                color: #ffffff;
                                              ">
                                            Copyright © 2021 PearPixels<br /><a style="color: #ffffff"
                                              href="mailto:info@pearpixels.com" target="_blank">info@pearpixels.com</a><br />
                                            All Rights Reserved &nbsp; | &nbsp;
                                            <a href="https://pearpixels.com/" style="
                                                  text-decoration: underline;
                                                  color: #ffffff;
                                                " target="_blank"
                                              data-saferedirecturl="https://www.google.com/url?q=https://pearpixels.com/&amp;source=gmail&amp;ust=1653748262291000&amp;usg=AOvVaw1MeCtAe9zcQ-T_C16pa8wa">View
                                              Online</a><span></span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="max-width: 600px">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding: 15px">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="
                                                font-size: 12px;
                                                line-height: 18px;
                                                color: #9da0b1;
                                              ">
                                            <strong>Customised Solutions To Cater Your
                                              Business Needs Specifically:</strong>
                                            With a pinch of ability and pint of
                                            colours, we have a tendency to produce
                                            appealing styles that enrapture the
                                            audience. We have the foremost intimate
                                            with graphic designers and professional
                                            developers in our team that will assure
                                            you to produce the best and unique work as
                                            far as customers need are concerned.
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="yj6qo"></div>
            <div class="adL"></div>
          </div>`,
              };
              transporter.sendEmail(mailOptions, (err, success) => {
                if (err) {
                  console.log(err);
                }

                console.log(
                  "Message %s sent: %s",
                  info.messageId,
                  info.response
                );
                res.json({ msg: "email sent" });
              });
            });
        }
      }
    );
  } catch (error) {
    res.json({ msg: "Something went wrong" });
    console.log(error);
  }
};
