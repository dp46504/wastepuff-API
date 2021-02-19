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
const addPackRoute = require("./routes/addPack");
const getDataRoute = require("./routes/getData");
const minusOneRoute = require("./routes/minusOne");

app.use(express.json());
dotenv.config();

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const db = mongoose.connect(process.env.DATABASE_URL, () => {
  console.log(`Succesfully connected to DB`);
});

// Middlewares

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/addpack", addPackRoute);
app.use("/getdata", getDataRoute);
app.use("/minusone", minusOneRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening`);
});

module.exports = db;
