const router = require("express").Router();
const verify = require("./verifyToken");
const cors = require("cors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { db } = require("../models/Pack");

router.use(
  cors({
    exposedHeaders: "auth-token",
  })
);

router.post("/", verify, async (req, res) => {
  // get user id
  const userId = jwt.decode(req.header("auth-token"))["_id"];

  //   get user
  const user = await User.findOne({ _id: userId });

  //   fetch
  await db
    .collection("users")
    .updateOne(
      { email: user.email },
      {
        $set: {
          pack: {
            name: req.body.packName,
            size: parseInt(req.body.packSize),
            cost: parseFloat(req.body.packCost),
            costPerOne: parseFloat(
              parseFloat(req.body.packCost) / parseInt(req.body.packSize)
            ),
          },
        },
      }
    )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = router;
