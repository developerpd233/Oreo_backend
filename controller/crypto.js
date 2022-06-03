// crypto.randomBytes(32, (err, buffer) => {
//   if (err) {
//     console.log(err);
//   }
//   const token = buffer.toString("hex");
//   User.findOne({ email: req.body.email })
//     .then((user) => {
//       if (!user) {
//         return req.json({ msg: "No account with that email found." });
//       }
//       user.resetToken = token;
//       user.resetTokenExpiration = Date.now() + 3600000;
//       return user.save();
//     })
//     .then(() => {
//       res.json({ msg: "email sent" });
//       transporter.sendMail({
//         to: req.body.email,
//         from: "noreply@aaron.com",
//         subject: "Password reset",
//         html: `
//             <p>You requested a password reset</p>
//             <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
//           `,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// crypto.randomBytes(32, (err, buffer) => {
//   if (err) {
//     res.status(500).json({ msg: "Request cant be processed at the moment" });
//   }
//   const token = buffer.toString("hex");
// });

// Form.findOne({ where: { id: id } })
//   .then((result) => {
//     const generatedLink = `http://localhost:3000/client-form/?invoiceNum=${id}/?key=${token}`;
//     return res.send({ link: generatedLink });
//   })
//   .catch((err) => {
//     throw new Error("Something went wrong");
//   });
