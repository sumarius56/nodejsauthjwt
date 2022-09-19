const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

//Register
router.post("/register", async function (req, res) {
  //Data validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user is already registered
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send({ message: "Email already exists" });

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(200).send({
      user: user._id,
      name: user.name,
      email: user.email,
      data: user.date,
    });
    console.log("Saved user to database");
  } catch (error) {
    res.status(400).send(error);
  }
});
//Login
router.post("/login", async function (req, res) {
  //Data validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Check if user is  registered
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "Email or password is wrong" });
  //Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Email or password is wrong" });
//Create and assign a token
const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
res.header('auth-token', token).send(token);



  
});

module.exports = router;

// https://www.youtube.com/watch?v=2jqok-WgelI&ab_channel=DevEd
