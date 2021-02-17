const router = require("express").Router();
const User = require("../models/User");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const corsConfig = {
  exposedHeaders: "auth-token",
};

const userSchema = joi.object().keys({
  email: joi.string().email().max(255).required(),
  password: joi.string().min(6).required(),
});

router.post("/", cors(corsConfig), async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //If exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Wrong email or password");

  // If password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Wrong email or password");

  //   Create and assign token
  const Token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", Token).send();
});
module.exports = router;
