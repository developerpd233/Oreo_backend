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
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email: email }).catch((error) => {
    console.log(error);
  });

  if (!userExists) {
    return res.json({ message: `User with that email doesn't exist` });
  }

  if (userExists) {
    if (userExists != null) {
      const isMatch = await bcrypt.compare(password, userExists.password);
      console.log(isMatch);
      if (userExists.email === email && isMatch) {
        // Generate JWT Token
        const token = jwt.sign({ userID: userExists.id }, "myJWTSecret", {
          expiresIn: "1d",
        });
        res.send({
          status: "success",
          message: "Login Success",
          token: token,
        });
      } else {
        res.send({
          status: "failed",
          message: "Email or Password is not Valid",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "You are not a Registered User",
      });
    }
  }
};
