const User = require("../model/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // if user already exists
    const existsUser = await User.findOne({ where: { email: email } });

    if (existsUser) {
      return res.json({ message: "A user with that email already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);
    const user = new User({
      email: email,
      password: hashedPw,
    });
    const savedUser = await user.save().catch((error) => {
      console.log(error);
      if (password.length < 7 || password.length === "") {
        res.json({
          error: "Cant register, password must be 7 characters long",
        });
      }
    });

    if (savedUser) {
      res.json({ msg: "Thanks for registering" });
    }
  } catch (error) {
    let isValid = email.includes("@");
    if (!isValid) {
      res.json({ error: "Email is not Valid, Please enter a valid email" });
    }
    if (password.length < 6) {
      res.json({ error: "password length must be more than 6 characters" });
    }
  }
};

// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email: email }).catch((error) => {
//       console.log(error);
//     });

//     if (!userExists) {
//       return res.json({ message: `User with that email doesn't exist` });
//     }

//     if (userExists) {
//       if (userExists != null) {
//         const isMatch = await bcrypt.compare(password, userExists.password);
//         console.log(isMatch);
//         if (userExists.email === email && isMatch) {
//           // Generate JWT Token
//           const token = jwt.sign({ userID: userExists.id }, "myJWTSecret", {
//             expiresIn: "1d",
//           });
//           res.send({
//             status: "success",
//             message: "Login Success",
//             token: token,
//           });
//         } else {
//           res.send({
//             status: "failed",
//             message: "Email or Password is not Valid",
//           });
//         }
//       } else {
//         res.send({
//           status: "failed",
//           message: "You are not a Registered User",
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ error: "something went wrong" });
//   }
// };

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      res.json({ error: "Email or Password cannot be empty" });
    }
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const password_valid = await bcrypt.compare(password, user.password);
      if (password_valid) {
        token = jwt.sign(
          { id: user.id, email: user.email },
          "pd_JWTSecret_123"
        );
        res
          .status(200)
          .json({ msg: "Login Successful", token: token, status: "success" });
      } else {
        res.status(400).json({ error: "Password Incorrect", status: "failed" });
      }
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  } catch (error) {}
};
