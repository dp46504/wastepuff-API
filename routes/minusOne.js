const router = require("express").Router();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const verify = require("./verifyToken");
const User = require("../models/User");
const { db } = require("../models/User");

router.use(
  cors({
    exposedHeaders: "auth-token",
  })
);

router.post("/", verify, async (req, res) => {
  const userId = jwt.decode(req.header("auth-token"))["_id"];
  const user = await User.findOne({ _id: userId });
  const pack = user.get("pack");

  //Dicrement one from size
  await db
    .collection("users")
    .updateOne(
      { email: user.email },
      {
        $set: {
          pack: {
            name: pack.name,
            size: parseInt(pack.size - 1),
            cost: pack.cost,
            costPerOne: pack.costPerOne,
          },
          wasted: parseFloat(
            parseFloat(user.get("wasted")) + parseFloat(pack.costPerOne)
          ),
        },
      }
    )
    .then((result) => {
      res.status(200).send("All good");
    })
    .catch((error) => {
      res.status(400).send("Something went wrong");
    });
  // Delete pack if it was last cigarre
  if (pack.size == 1) {
    await db.collection("users").updateOne(
      { email: user.email },
      {
        $set: {
          pack: {},
        },
      }
    );
  }
});
module.exports = router;
