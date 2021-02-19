const router = require("express").Router();
const User = require("../models/User");
const joi = require("joi");
const bcrypt = require("bcryptjs");

// Joi schema
const userSchema = joi.object().keys({
  email: joi.string().email().max(255).required(),
  password: joi.string().min(6).required(),
});

// Registering new user
router.post("/", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    //   Check if user already exist
    const alreadyExist = await User.findOne({ email: req.body.email });
    if (alreadyExist) {
      return res.status(400).send("User with that email already exist");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Making user schema
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      wasted: 0,
    });

    // Adding user to database
    const savedUser = await user.save();
    res.status(200).send("Succesfully added user");
    console.log(`Added user: ${req.body.email}`);
  } catch (err) {
    //   Getting errors
    res.status(400).send(err);
  }
});

module.exports = router;
