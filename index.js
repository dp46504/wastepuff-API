const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// Import Routes
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");

dotenv.config();

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const MongoClient = mongoose.connect(process.env.DATABASE_URL, () => {
  console.log(`Succesfully connected to DB`);
});

// Middlewares
app.use("/register", registerRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening`);
});
