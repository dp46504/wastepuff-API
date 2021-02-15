const router = require("express").Router();
const User = require("../models/User");
const joi = require("joi");

// Joi schema
const userSchema = joi.object().keys({
  name: joi.string().min(6).required(),
  email: joi.string().email().max(255).required(),
  password: joi.string().min(6).required(),
});

// Registering new user
router.post("/", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Making user schema
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    //   Check if user already exist
    const alreadyExist = await User.findOne({ email: req.body.email });
    if (alreadyExist) {
      return res.status(400).send("User with that email already exist");
    }

    // Adding user to database
    const savedUser = await user.save();
    res.status(200).send("Succesfully added user");
    console.log(`Added user: ${req.body.name} | ${req.body.email}`);
  } catch (err) {
    //   Getting errors
    res.status(400).send(err);
  }
});

module.exports = router;
