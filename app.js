const express = require("express");
const sequelize = require("./util/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const User = require("./model/user");

const authRoutes = require("./router/auth");
const paymentRoutes = require("./router/payment");
const contactUsRoutes = require("./router/contactUs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   // OR below LOC to set all headers
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use("/auth", authRoutes);
app.use(paymentRoutes);
app.use(contactUsRoutes);

app.get("/", (req, res) => {
  res.json("hello");
});

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });

// localhost:8080/login ------------ post
// localhost:8080/all-invoices ------- get
// localhost:8080/invoice------------ post
// localhost:8080/paypal-payment ------------ post
// localhost:8080/edit-invoice ------------ patch
// localhost:8080/invoice/:id ------------ delete
// localhost:8080/get-in-touch ------------ post
// localhost:8080/contact ------------ post
