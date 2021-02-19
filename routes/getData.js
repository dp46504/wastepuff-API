const { encodeBase64 } = require("bcryptjs");
const router = require("express").Router();
const verify = require("./verifyToken");
const cors = require("cors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.use(
  cors({
    exposedHeaders: "auth-token",
  })
);

router.post("/", verify, async (req, res) => {
  const userId = jwt.decode(req.header("auth-token"))["_id"];
  const user = await User.findOne({ _id: userId });
  const pack = user.get("pack");
  const body = {
    name: pack ? pack.name : null,
    size: pack ? pack.size : null,
    wasted: user.get("wasted"),
  };
  res.json(body).status(200).send();
});
module.exports = router;
