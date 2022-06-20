const paypal = require("paypal-rest-sdk");

const nodemailer = require("nodemailer");
const request = require("request");

const Form = require("../model/form");

const CLIENT =
  "AeTEX8t3jf_1BRGAHvZV0Sf4NbKzXwBVvN2crSs_faGagytX0zRcXM9GD8wSc2r_zHmmRwSMA7E2i70r";
const SECRET =
  "EP5WJjziwrS3mi4ZPj3ogu7wMD_cNfWrR75JxqzQaNq4ThE7Lllv4WLNBzeZWWcMAk8o6J9c1YzvQl2A";
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

let transporter = nodemailer.createTransport({
  port: 465,
  name: "oreostudios.com",
  host: "oreostudios.com",
  secure: true,
  auth: {
    user: "info@oreostudios.com",
    pass: "9#WhN%V}3LXj",
  },
});

// paypal.configure({
//   mode: "sandbox", //sandbox or live
//   client_id:
//     "AeTEX8t3jf_1BRGAHvZV0Sf4NbKzXwBVvN2crSs_faGagytX0zRcXM9GD8wSc2r_zHmmRwSMA7E2i70r",
//   client_secret:
//     "EP5WJjziwrS3mi4ZPj3ogu7wMD_cNfWrR75JxqzQaNq4ThE7Lllv4WLNBzeZWWcMAk8o6J9c1YzvQl2A",
// });

exports.paypalIntegration = (req, res, next) => {
  const { name, email, price, currency, description, link } = req.body;

  // 2. Call /v1/payments/payment to set up the payment
  request.post(
    PAYPAL_API + "/v1/payments/payment",
    {
      auth: {
        user: CLIENT,
        pass: SECRET,
      },
      body: {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              total: price,
              currency: currency,
            },
          },
        ],
        redirect_urls: {
          return_url: "https://oreostudios.com",
          cancel_url: "https://localhost/:8000",
        },
      },
      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json({
        id: response.body.id,
      });
    }
  );
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

exports.success = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const { name, email, price, currency, description, link } = req.body;

  request.post(
    PAYPAL_API + "/v1/payments/payment/" + paymentId + "/execute",
    {
      auth: {
        user: CLIENT,
        pass: SECRET,
      },
      body: {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              total: price,
              currency: currency,
            },
          },
        ],
      },
      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 4. Return a success response to the client
      //send mail
      const mailList = [email, "info@oreostudios.com"];
      let mailOptions = {
        from: "info@oreostudios.com",
        // to: "info@oreostudios.com",
        // to: "misbahzahra12@gmail.com",
        to: mailList,
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
                <tr style="background-color: #3893E4">
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
                                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANMAAABlCAYAAADXlNaxAAAABHNCSVQICAgIfAhkiAAAIABJREFUeF7tnQvUJMVVx4cFAsvy3gWW3bCZBQJHdJVAjCRG82GiiYqK8S1RBw2YED1CjFGj0YmKGokm0SQKmjiYxFc8RsUomoeDiqA5KAaEgLA7C/J+v9kFFv+/3r7f1lfb3dNdVfPab+45dWamp95V/7q37r1VvVdrtuh9qu5PKHy7wl/NVtXntd3Te2CvGWvg83l952CasYFbDtWdNTD1NSivUjhM4eHlMEDzNs5OD8wamDrq2vMVTp6dLp7XdLn0wKyBiXFh3wSgjM7M91H8fv98L7Vcpu70tXMWwXSoI+Lx/SGnW6/Q94Xp6+Z5jZZDD8wCmADMlpzjnO0NCsD5J+fZu/S9uxwGbt7G6euBWQATvdbJQ0+fBCMXTMO40tcq0SaFD07fMMxrtCf0wKyAyfoaxcO1JWA6Xc/7JYMCd/uiwlEKs9bmPWGeLYs2zPrEsj3TX2u0UESU0SX64xyFDyu8cVmM7LyRY++BWQcTHTZQ6Cr0Snrv5Xr+bwoPKByvMLdPjX2aLY8C9wQwASJU5UUg2UfPr1c4UeEHFD62PIZ13spJ9MCeAKZ2zp2K+u8denihQl+BPdWc5j0wsh6YBJiOUWtOysML9XmEwhqF/RUey8Oj+Scq8b9V+L+AHtioNDfm6b5En+S13ImF50UKKHLYbxYRHB4lz1aFwRR2GPX+iiFtoNq0gbag5R0LjQNMDN43Kyzst99+p69YsWKNPlsHHHBA67HHHmsdc8wxrS1btrROPPHE1g033LD4yfPbb7+9deihh7YeeOCBm5T+swqXK1xWs2ewPy0ovFPhV2qm2dOiAZpvyycefVEGoKp29/UnHvpMSleTOq6+audtoP6hbaDetINPlFUj2TePCkwHq8Jn7bPPPm8QeF5x0EEHtQAQtHr16tY999yTgQiw8HnzzTe3TjjhhN0+b7nlltbxxx/f4nP9+vXZp/K878knn7xUWV2scEvJiH6/nn9cARB+mcKz4xr5KSiHyfdDCh0FvqekgTLrKdD/fB8VAXoWgVH5YbI40A6AlYxSg2mdavbWlStXvkngWQX3ATx33nlnq91ut2699dbWcccdl4ECkGzevLl17LHHLoJoMBhk8Qxk9ttPB/he8IIXwLH6Ku83FRAFjRgIQLZa4RUKVyXrreYZHaIk35CHM/S51skCDePvKXy0ebaFKeBCnPXqJMpvWDY9RQBUjEEqYuxoAyAK4aJN6zFQgq5CEm6VCkzkc8Hee+99ocDD3qe1bt26DDSIbz54brrppozTIN6tWbMm41SA7uGHH87Euu3bty9+CpjZb7gbYiHxABugu+6667J4995775Uq8scUYOPTYFM6UvXAtelNNUb3OsVhFQ7d07WV9r0KVXa2GtUIjgKYcPNiYobSuEHk1xOxDwCzOARTCjC9SKLXxw4//PBXMtlPOumkDDwbN25kkmeTXxyk9eyzz2ZgARhNSADN9ld8HnXUUS2JeBmwtm3b1nruuecyMAFO4qgc9lWvVpiUTQlFys8onKewskE74aQvUXi8QRqi/qJCt2GaUUV/nzJmAWm6H1lQmj9UaI+qYg3yZTFmYQjaG8aC6UxN4t7zzz9/CCC66667somu363HH388AwBch0lPcIn/iAvncempp57KgEd6nxDtAKOVhYgIlzrssMNa2pu1brzxxm1Kw+bsDQrsmcZJr1Fhf67AwcUQQoX/8zUTItIxAfmcJmoyGeFGLAZwhGkj6sRxnkYUA6YPqaQ3M7HhEoDg6KOPzrjSwQcfnE1ynxD94CxwqCOPPDIDQREBMNLD0RDn2Dv5BLBQXpAXca6//vqsHqK+wrhtSj+nMmM1hvgOosIfRh1FQKwbx55iWF2K/oczXaDQq5GYOChLppFQUsClanPaEDCxJ7pMwHgNItbdd9+diXR33HFHa9WqVRkITJSD8wAwgMZzfgMmn0tV9SRlABgI5QXpER8tD/4HWHoG60NrZzYl6onI1R3hSK1X3n+q8MpEZcCmn67Iq6P/4EizQHVWdxaEvgJ2o2kkOC0Lcy1ANQUTKu9PixO87P777880cuyTAAuE1g6Cs8A12McABIBkk5+JD4cq4jbWm6QnDpzJgMR/AIfn5GGcK09j4h1iEuIS9KsKP5tPvh8ewUjh54ctC8NzKsLQPCjJDBB1UhU0pnx6KofVvYoQVf9rTPUJKYbxAFBl47KYZxMwAaQrtNc5GQ0dBDcCUGjV4Ebsg5jsiHAAwUBkAOIT7sR+iL1UzlGyvEgL4Ex049P2Uzy/9tpde0LyQLTjOer1p5/OFnPXpkQF8cnDNw8CWIhiqQggoUFEa5eSysDEKo9oN4uEyIdyooq6+pP907RSLQ5VF0yITFcKKKcAFFTaiHZwJWxAEBMfkAEq/jduxX8ABXCg2YPwdACExEUTZ+AAlORBfPJgPwbwbrvttiwO4p1La9eu5dkzO3bs2FfPXZvSv+r3V3sjg+o8xcFAbGkAqZ145J9UfqsK8uzo2ayIdmVd8gf6gyMwVTTQn3jLTCsNBVRdMF0sEJ3LfmXDhg0ZR0HRABhsf4QIhlhnop7bIyeffHLGiRDZTK0NmOAsAMjdQxEXMG3dujUrhzLhQpQDCD16Rr8BkjtYDBq2Jp/YT7G3+ffI0bpa6b8qMo+i5H+ph9/h/THtIlCTbhjGobCTfbJJhhOIi1KCOxsLqQ6YvkkpPwWXYHLDJdDWAQ64D5wE7lJGcCwMs3A0QAN3eeKJJzJNHpwKdboBkN8Ah2cPPfRQBk5sS+TBHgvREdCa9jAv07Upwfqw2ZRpulAxfqkCDrUh9FYlwuNiFAQnxSvCiDZgyJ1WrV3TPuACUa4OQGooo4H+mGbuRL1LF4VhYFotLnGTtGirAQETmQlveyRyZqK7Ip3bS4APcRAAAkZTKAAY41QAzLib7ZEAGuAzzR1aPFyIECvZkz344IMAapvsWb5N6Y9UPueWqogzTcPiFKU/QQ//WyHz8EhMH1B+P+7lySrNaj0quiLP2DRVBlou+RwVUVaVHa6j/5uItOyLWUwhxsU0ocfqO6cTRkWFe9thYGLincVkzr23My5i7j4uh2BPxG+AgKYP4Lh06qmnZiCEkwEyCLHP9lwWF7CgTjeCIyEaGifk+V577bVDQFqhr30Fsykt6Lt7U1FVR5KGtHUJRcZ/KnAhS2r6hDL8XoUdTsajEHlYCHp5u3dpc4pbg3hJf3YUUquth10dAODwaSwiawPSh+uPWRQXDsekP1eBUwso0FJRXxntZsusAtOrxCn6cBQAZEBh8puygYlu+yC8vs0D4sADD1wUy6z2AAixDdCRH+lsr2T5uRo79k0AGG9zdx/Gb9XFtylRDJoQVqQ6dJsiofGrsum4+bxNPy6qk3GDOHAeONLnvDSpxTs4UFeBCRBCC3n6VBwLcY9JvrWkMmj+cHZ1iTa8R2EYgKra18nbkUqMROXfcwusAtNVmuSnmchFIpvsAAwRDDAh9gEQJj9gAjSmtYM7FdmTAA9AMQIg5l3uVo78fNp33323P/PMM7A2VN2ovKF3KfxCVU8W/FfHqEiyAxQYePzuUtDvKpN353kW5dfVwxRq4keUT0eBTXMKWlAmPYUUkxFwkF8RuUoX2sBpabxtUhB1/zWF70uQ2UB5sCgsUhmYvk6i1WfhNuxTENukfs64CWIYEx/NGpyF73ZWid8SwTIFAwQ3K3JsBUgoFowAIgDz/fHQGJZ4S1TZlOr2E0htKwzzvE2ldEBkZmLs7me1q8apuBJHCjoKtSz3dTtM8agfnCPWBWgYd2KiUnf2kf/SoH51o9I3tKNMnKybzxLuVAamywWm1+I8ii0Hse2aa67JuA5cCVEPkEEAw1x6HnnkkczJFcABEIDEPsklc4R1n5n4V6QVBEyOgoOJD1dybUp0dqg7z5uVljNFZcS+DK4U4+WAdwaT789qjFAK4+ylKofJMkrq5W2KKaOKO9EPlJF6MXDre5Z+xF6wM1Aei9ypCEwbFGEge0/2n+sOhBYOLuROeoCEmAfQ4CyAzPzxiOdyFlN9Nx0BgCwym9Lv6zubSgi7zF80zc+J/3l9f1lFemwK2H9CCfB/vcI/18wAVXi7ZtyiaMPuD4zIerekiI+cwwol7H7YCCdJHRXeRHtYVNdFZVYRmC6UyPUOwIHjKmAxcQuDqqmoLVfb+5jYhtYN0CEGwpkQ33z1t84/LamU+fKRt0+eqOifU4JNf0GBBSCUjlPCzSWJuW+CE7Kh1OR6sQUVUlcbWVQfNF3kMcrV3C0XkQ+tYMwe6teVHv/JSVJXhcfsURclgSIw3SxV+IvtxCv+dXAnwIXx1fdwQGyDUEgAKPZX5uDKf+y7IEQ185qwngNEdvgP7mYcz/WsIK72YWZTgjX/sdfzrAy+RqzJ4PyyIpcpL/DgDbUrfUppmwCxp/gxe5Gm6v4mfVQWF/DGLAB3K/0uO0iKGoXlwaIQagJYtJ35YHqhJvftTHLAg6cDQHI9t10glBlrLY7ZlOBWiH+IiOZ25B8KLOoD0kijt0Ofvk3Jj/6PeoA4FULcEcEezCfubviHkAzzNNikMCrWpRgRb5zind8ebD5w9xBCEcHYTpoWVIGYRSFbyHwwnaPJfglGWgiwIK4BLLgOXIrviG0oIiCAxslY1OC+5o49knktmLqcPHnmGnzhapavaQbhamgG5ZleZFPyOx8OUPcKMD8tsjtWef9oL9wKlXsIsUdqYpdpKz5gCiU2wYPQxEPSfbn+Z7IVESBmEWMfG0oYrOsoZ0Lzr5uO/gsVWZknXR9MH9GkPpu9Elo5c1w1UcyAgXYPG5CJcCge8PJ2weQex+A5YEME9OPgNgRQiU/+uC05nNDOKbk2pbLOuUN/4NEdQnChT3sJOfT3PSGZKU1dG5Zl39GX0I1wCq5EfV+a9x93UeCmVecOC/NTg8OE0jCPiNB8m6YrMhbXzSPTTPpg+ry40ktNqQAn8o89mLsPxtj9998/O0sEp7KrvAAEIhw+eXAb9lh+HlZDuI/tudxae6Cre/dddoy+buu9eEWTnw09q3IIvViJyu70K8qvq4ehm2A0jiGGWcwJAJizWaGEGPw6BW7c5dRxCFWpyEPyC03jGoub5jFQgo0+mLYLCPsCAjRuiF+IZSgHmOB8R7wDLAAErgKHQhVuNiU4zKZNm7LfvsKhYQ2LbEpVWXyL/vybhmVY9CJH0wf1Z8jlKFjtd7l31KtQX9GaiIWWa0hZpIXj/olCmZ2xXq133vK6oIACiH1DCE2LEoK6A4pQUU+bkl10hIBwL+pvIzv2gJOqnSVCqeCeoAVgiHuIemjj7HAf3wEl55bsViHAZeB0FRDkx3P2aoBR3OxZ5Yf+nHNJP1pzhPASxucuhP5eiThq4lKo6PIZZdJUGdJXmhAwhYp4LFQpbDwGBFTcPx3S8UoTuiAEFleZLHQcyPR0F0xsYjcfcsgh2bVZKBXs8hPAlBtOs8mOSOeKgigN7Ai6XXNsd+gR325mtZO15Ad47KZXvgM+nt93333ZkQ1RyN13oapszhG5J3M58dr0DjsbpSYLgKUJ1eRlG9+Gs4qDlD/SME1ZdAPCmYqAN0HRSeFhRQHsnXdnT556qkKoeWIJmDZp//IFUyrQLuNGiHYumMxAa25EFo/9lOshATjM2dWOcZAPz11ORlmA6ZRTTsGZdpv8AOlc7gtHFGlCoUoIfJ7c/RHiHWJeCGGEZKVuQqFccNjp1aI6xKiy/fxMtY04A0feeS9Bc4oVN5uXWJyiq8ehe9clYOIE6vWmEAAU7JPM8Gpgog6uds89HIiIB0cywy6gsZO0prgwMMGl7P48iyM/wB26OmyYTamq41BW7LQSNyM8IFxbCZPi/mZZLMbG1ampqjgUTGerrF7DeladF2qYVRa9rbBVIXQhIw8Wr3F5blS1MRmY2gLGFrMfUSLuPYh7LmfiuV0A6R/sA0yIhnYB5TAw2Y1Gzt0OdWxKVZ2BfBhywtK/ADIGTN+tOnDgrwmFgilEzEsNJuOOoQsZ/VTlhdKkH2PjJgMT53Xu8zkTtXP3TG5t4VAYY031jdaP9AYO0vEf4CoS8+BgiJXE177JbEocU+DMSQixzwmR2/9D6dxLUg7X76VHhevXpshmNSz1OMGUUsyjXajlUc8j5nHPewhxjRlHXSZNMbamJWIeRronUWvbsXLT5qHhc49doBI31yBab9d1IeKRnriIcHzHBgVYjOPx3d0zEYf797jXgawUQt+nlC0GgaPha+BiOBOXhjQ9gxPqGxaizeOiTjhBKuLtjLjD9BRCN+9mr0pVp9B8+koYolWlvCVg4sHj4jSrzNvb3lphr3OxGiLO4QUBATgUEdilAJXdj2dvpkDzZ+SCDOCRlvNS8t3bLo8L/5xS0w75GiWoe9TBzxvjpXvrawyY4HBwuiYUOogDFYIWtimFcvCictCgchoZxYudfG5an2mxNYWOA+3dzWh7lcSx00ztXXTsHHHNBdmjjz6a2ZbcO/BMdW7czAej19P4xmFT4k2Add5nVDZQMYPpi5Yx2rxTVMGm1/32lCZ0Vcf9B87WhLLr25okGBK3nYM61FnUAJmwSo2zwtD+UONUuxIsMdry+GIB6Vz2QjiZ2juV0MTBScw3zzweUDZwRB3blPnrmSYPDmXXJNuNRn5F8f0jD1GITcnPDu/v0wI747uUzj1kGMOZOGzIocMm1FXkUJXs+5UWd6imhBdET6HsiAmXzbCPNaBWuSxxOQzq7Rhn3Uk7vMacci70zXuLwPQBOIvd/c0lKubBwGjxnD2UuQsBGvMYJ557xRccCSACNLszzzvOwYAxmFxwgWNpKOECwkCG2itI73pPxIAp5NWfCyo/dFVHO4eoF6paRtnzcqfjAQ0gC8mPlbGOg2zROPNuq1DH4tB546ZDmtjl/tMsx0sVveNPvtMEiKs4BAjHcf3z3LwBExo64tneyY5ruPEMhIAKLmXiY35Oye6R6CtNqF+XFce7kUIv5vdtTOQZo81jAxuydwvV6FHfEBV5s+lSL/blivbaelF3i/WonsRecBJYdGYri+Gqmb3PBxO/7xQ3WWsXQZpGj72ScRfAYfYnntlrNv3DgmjqzIjr3kmeux7F2pSs44ZdiTysg4sulY/hTLxBkNeBNiU4QuidCnAR9k6DpoUmjt9RfqFHSagKSqCY9KHN6Slh6J6VMjOjc5FY9EFxkPMQ5zjTxL15cCG7nstuG+J/u4EITuUeOWcvZC9zNm2ed2zdbEohrjd+h9W5Ermqk9mM4+jqUgyYvlEZsUI3pRiZnbLY2wCoSVLsJn4SbVhQh4WK2PQ1R3Uy8bAITIhcn7OjFgYCtHVwGu8lY9nA2RvRzcZkt7uieEC8g0wDqEskW7pEkkcxNiWbMN+pL029DdzJhl1qrYJ7NTH/x2jzOPUboimLnYjUu6eAyDFJiuGw1HucIit9jnjX9MiM27+LLl1lG/Y7BIJ19mZz9kZwJLuA0r8Lz45aACpckEzpAJjsVlaLo5c4p7Ap0RhWA7y9Qze85MHNqryq06cYzvR6ZRb6ahTAECNuTAOg8CAPbb+NQ4jPYdMFBADBkUKVDlbeol9hGZjOFzDea28IxCWIV7zApeA+7JHcW4rsnUrkzpklwGfKBveVMfo7lU3pVOXFgbSYy9ipC1eE7X4H807v51BHV1/N3mSQF/IBbpKmKC6gnCSHGqj80EN24wBUKiBlWjyrcBmYVmo/dJu8IdagaFi/fn22P0JNbl7k7mtl3NEEgLgGmTKCT++KY6zdvMQ5RPVKUVyZC0eJ4Ujk415m6U/IGDDF2kv6qkyoS4vbDvYf+MwxscdNTLAUigR85RD7QudKUbvhRHDOdoJOwSSx2L9Vdpm3CzjvtlO0vFUdfzy4lN3gal7jLmfiGc6vBfdImE0pdLItqOLdRBONfqQzt5Z0aIxqvOhuvybjRjtjNsR+WfQZht2YCYmWEfGNutkk7Ot7T4HVuYiYZLHciXzJB8/0KqNxnf6FG/F2DfojBS3hSmRYBSa8r2+UuHcMGj278tg8wt1zTPZSM/OCgHvx3XzxnJqHODRi0IUbuYbF2M5w38pelFcMZ/pBZfjRyArGbuL94gFST4EJAMeqQ21FAkRoGfleRn39AQf0wZpi7+SWSTm0AefeJgsDnIh9aEchRtHg1oUTxvTJknpUgYnErxZQPsM+ib0Pd93Blew9tIAIboUaHDEQEc/e12T2JbR54mbYlDiezME9brKBflKB+5D9V2LurWccVETNi80m5tJ8twPs+//oC57pVRQDJgatbLUeUuzi3wz6QGEURkzyBVAEJoOBq63vFhby73XrSx5ogf1JnnpRsPr0vfq75VobABGB36mpUEEyDExUIrszAHuRnV0CVIAGexJkLkJ2kaTZn/hP90nYMXS0Zux1IOTgpu9TStEhABpHVABVRTFgSmV4TL2yp+i/qjwADhzKpbZ+ALRRLAqjbk9Z/qXHXuqAicvEvygPiHX2gmZA5V/gX/VuW6XnmmBWCTgUb+zj99Lb+8fTNcjMv12jqBg7UyowUU024P5b9GpUf2JR4E59r/RZWxSqOo89NvO4UMysAyYy57KRqyWyrcSGxGG+I444IhP7TAlhh/+42dV7nxJXSn2lQvZeGFHM+5RiZknRylmWXwxnCrkDoqpdTM4U2r2YvqubdrdNeZ5w1haFovayT1pQKN1z1gUTmZ8hMQ4Wt8Luwtu6dWsGKvz3UH+bUTe/xdVsSrxMzG5aZdXmOtxxE4f1ODw47C2BVq8YMHEmi7NZqYj9E4AKfUtDqnrUyWegSKiLi6inh7EG6Tp1GFWcwn2SW1gTMJHuAu2HfgswwZ02bNj5WiTU5vaaTjR5iIH5u2yxKXFVMCc7maD/q4AINU5if8SdeKwsdSkGTOepEN5bm5JmCVBVc2pWATUUSAx2UzCRhosvLhIXWoGmDrEOcKHtw8Cbv/+2yKYU65AaMjmvUKJvVcC9vwkxeUNPXQ57tWeTerhxZwFQi06fFY2cJUCxAJ+vQJ2HUgiYyPQMcahPKOzPBf1o7wBRrjZ/XsctyNe1KbExjXkh2dCGFEQouj+8bj7c3Yc3bsi7g3g1aMyrO4fVcZonY9meyW/TNLfB6jp0j+Q3KhRM5MMrSC6TSLcWh1hsTIh7Cnhgc8TCbErczsoNNmWy9LDJ0/R/ymZv5r9hsGk+iKQhb4jALsaFjKMkVsuuwrSpnIu0eWX90NEfKCamrQ3UF4mG+g2aDGIMmCgH0ePDUky8Hq60efNm8wjnEvffyCsyTpsSp2bhDKUalwad80uK+84G8Yk67IXTDbOrjI6KtqcwLYqJkLso2nkbpklbyXzthgxULJisTM7uo6XDBWkSNiX2Nxxd/x2F7LBUAmLF5MJG7uOrSyF35tXNuyxeR39MeoUPnoB5o6ahDWiq4fiD0AFJBSa0X7cqcCTCtSldqd9F74sNra+fjmMSAIgQqjCoqgv2Nd4ouPOEYzXFOrgOy7/qfyQEJgJhnGITE7CrkEISmFQbEOloQz9mAEibCkw95YUNAZUwqmHojQpNL7Cv2x60Rlypy4Z31ASQuAEVY2wRcdKXa7rYF06amJB4HACqUYl/bMx7CnDDwQgaTBs6eRhVG6g2c4c2pFgIsm5IAaYF5cORAdemRN5HKfBaGALKilhCvf13CsjmV8dmFpiee/nYq3DUHZcSriej3dNI1LOjwPjETkrcaPAg6eef42pvyjawCFj9aQvjl5RiweRq6tg3cfdZEWGoxcF0Ux7wCkeEcg/4casndzIgurmfKBW4OgtuNKewHmC1X1BgcrbzQE7uxp/JZqs0E43vFgZhxSZN5baBdvC7THEB+Kkz9eez77QtaaXczGLB1FVmiDgh55RG1qh5xvMemEQPxIDJvL/RnrnnlCbRjnmZ8x6YeA/EgImbgTj9+naFiybeknkF5j0w4R4IBROOfx9RcG1KE27KvPh5D0y2B0LAZNcRY89wbUqTbcm89HkPTLgHQsCEfp5LQz6k8JYJ139e/LwHpqYHmoJpQTUvsilNTYPmFZn3wKR6oAmYXJtSyBvFJ9XGebnzHhhLDzQBk3l/z21KYxmaeSGz1gN1wTQum1JbHYjrCxZurNdYspP5Ts3a4Oyh9WWrwIvdcDAdFVGGuVDZPBqMqjDLty6YPq4E+Nj9lMJ7RlApwIPjKp3gE50Qcz1uX+nrnpcJPUrgllHWp7TNrj0+Xd9J05S6SoDHiU/m/kOesVchkzenlDsKvFazjsf8sHaQF1eWMc4uMdFxNk3lsIyTL3ec42rkE32DSWcwrLKh/9cFE8ZZLiUZBZDaypf3ibodgB+e75zJBYc4KDYlOnFPB5PbJwCLxafXtKOc+Jfo+zkKTygcGJEPY8oi2RmSB3WlzjHOp+fnZVlR+BoOvHlE/hsjyyltSl0wRfTn0KR0pF0BRYeyUhkt5L/b+ux6/w3NOI/AQJLeiO9WHisiHW7U1xdCUyKNAXZcnAku6raJVd9dgEK5H3mmAlPP6WsWSMbW+ptxAABWZ+LCOUIJoGD79O9uANAdBUDNtoHvjFdymgYw0TAmYtnNNsaxYlYtt+MW9CNW3PIHwtrA83GBqagcd3UeqC6swiGUAkxuP5deKazKIW3wggAoZgFgHwaVieq2Dw/pj1pppgFMqTqzVoMVaU8GE33QVbB9VahonAJMPdUDCQBO0VYoWwxZLO2UNJJCp+5AevEMTOzDAGWqxbd2daYBTO7kpuKDPPTzT1a1lB2zp4PJnZyhCpUUYDKxq4or2US1BZWxD+WmiJDuveyAikCezKVRag+zdkwDmKgHqxGdUXZ/QU//xW5QbeD2dDDRTpvITCDa25RSgGmY2OXWqasfxk1D5ySLCPmUvegghWKmsh9DK950cOrEpzMYeGRbPtsK7pvn+voN+46l5QAmm8jLCUw2L5g3Z+bziO9Nm5vZAAACFUlEQVTMJ3eRDhV9h867aQJTUWXpiJ6CaXxeou+w7hgaBZioo2kIJ6mAoF+YQFvyDpoVMY+FEiUU2jbqn5o6ytAkn4G+h4qSlfWaFjBVaVpYZT6ZtyJG22MdMQowdZW5iSkMFAPmkyvThy4KbjllY5einBRinqtYKusTH/wxCgjLq6jv+a+nMGzBiwLxpMHEKoTFmgl+dt5gv0HuBJpWMLEYYHiG+gq+OIoIC7fgE+0WnyHk9oU/duTJfoE4UKiIR9oUYGJMzQRRpmGjzsSh/6Aq0FX1F2WZ5wML1aAgMnVAwonp/8oxmzSY6EwaaXujvr6zsrJZhOBK5+ffU3WCO8gpwGkdTN3NcEubWJn5ZKLQBgNQqOhFOV0F44CU5xLtMvINl17UoT9TgIlCegrGDRhTflu9qW/H6RfcoGysh1awoO0GXCuH/ofaeTnWP7Hcr7RukwYTFWOy0cFVN5EyOeh466Cmne3Gp1NTG23JH7DQjqo76mIHsqv8i3zz3PZh/KavAHIopQIT5fcUDFBl9YntF/IFiHg5VBF9w/jbYh3aP4XppgFMNhGZKHAiV4PHhrSvwH+DRC0HvHA/G4CYSVdUpY4eEoxLEQdbS08hdjGwvIvKpR30VWwZ5P02hTMUeM/W6xL0+4LyYLLzaYsmCyR1pV+odwoif/qIeeQuzoCIcggjARKVnxYwpejIeR7zHphoD/w/Ot5N+jb0BCQAAAAASUVORK5CYII="
                                                  width="170" height="" alt="oreostudios" border="0" style="
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
                                                          color: black;
                                                          font-weight: bold;
                                                        ">
                                                      <span><a href="tel:+16693066163" style="
                                                              text-decoration: none;
                                                              color: black;
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
                                        color: #0052D4;
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
                                    <span>Order ID: ${paymentId}</span>
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
                        <tr>
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
                              <a href=${link}><button style="
                                                                    padding: 5px 15px;
                                                                    background-color: #0052d4;
                                                                    color: white;
                                                                    border: 1px solid #5488dd;
                                                                    border-radius: 5px;
                                                                    font-size: 20px;
                                                                  ">
                                  Pay Now
                                </button></a>
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
                                        color: #0052D4;
                                        font-weight: bold;
                                        text-decoration: none;
                                      ">
                                    <a style="
                                          color: #0052D4;
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
                        <tr style="background-color: #3893E4">
                          <td align="center" valign="top" style="padding: 30px 15px">
                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding-bottom: 15px">
                                    <table align="center" cellpadding="0" cellspacing="0" border="0">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="top">
                                            <a href="https://www.facebook.com/oreostudios/"
                                              style="text-decoration: none" target="_blank"
                                              data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/oreostudios/&amp;source=gmail&amp;ust=1653748262290000&amp;usg=AOvVaw1cD2zI0-hT-VEDbvwXn4g9">
                                              <img
                                                src="https://ci3.googleusercontent.com/proxy/KTJz5p6ckOTgvgeQccFgKpAAEjqA6SB4hxkopwmKAyWloWyEiD4JbqCCXfD6x8me7BH0zcvZPaAa3zkn3nLreQjhQF-bWOTj48RZMJwLT-qoscxfO1gNJUeoW4Ldd4jl=s0-d-e1-ft#https://oreostudios.com/wp-content/uploads/2021/09/Icon-awesome-facebook-f.png"
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
                                                src="https://ci5.googleusercontent.com/proxy/j8HTuiMQFw3MsuaA93u7UBWQhlqRdrGmbbLExQE1Ok4xyuNlU3zqgQ4OUDuv_OdmKCVnCasAnStJSGTv8VkuCn0UbdfBsk9U2rR3No8E9QB7UTSI1YSOzQUDcg5arOKMdQ=s0-d-e1-ft#https://oreostudios.com/wp-content/uploads/2021/09/Icon-awesome-linkedin-in.png"
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
                                    Copyright © 2021 Oreo Studios<br /><a style="color: #ffffff"
                                      href="mailto:info@oreostudios.com" target="_blank">info@oreostudios.com</a><br />
                                    All Rights Reserved &nbsp; | &nbsp;
                                    <a href="https://oreostudios.com/" style="
                                          text-decoration: underline;
                                          color: #ffffff;
                                        " target="_blank"
                                      data-saferedirecturl="https://www.google.com/url?q=https://oreostudios.com/&amp;source=gmail&amp;ust=1653748262291000&amp;usg=AOvVaw1MeCtAe9zcQ-T_C16pa8wa">View
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
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
        res.json({ msg: "email sent" });
      });
      res.json({
        status: "success",
      });
    }
  );
};
