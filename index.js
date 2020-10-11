const app = require("express")();
const https = require("https");
const fs = require("fs");
const cors = require("cors");
// MongooseDB
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const { connect } = require("http2");

// Connection URL
const url =
  "mongodb+srv://root:Styczen019!@wastepuff.p1arr.mongodb.net/wastepuff?retryWrites=true&useUnifiedTopology=true";
// Connection PORT
const PORT = process.env.PORT || 5000;

// Funkcja logująca do konsoli servera wraz z datą
const log = (message) => {
  const today = new Date();
  const fullDate = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()} / ${today.getHours()}:${today.getMinutes()}"${today.getSeconds()}`;
  console.log(`\n${fullDate}\n${message}\n`);
};

// Funkcja sprawdzająca czy obiekt jest pusty
function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

app.use(cors());

app.get("/login", (req, res) => {
  // Nawiązywanie połącznia z bazą danych
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);

    const db = client.db("wastepuff");

    db.collection("users")
      .find({ email: req.query.email, password: req.query.password })
      .toArray((err, result) => {
        if (err) {
          console.log(`ERROR: ${err}`);
          client.close();
        } else {
          if (isEmpty(result)) {
            log(
              `FAILED LOGIN ON EMAIL: ${req.query.email}, PASSWORD: ${req.query.password}`
            );
            res.status(404);
            res.send(`Can't find your account. Check credentials`);
            client.close();
          } else {
            res.status(200);
            res.send(result);
            log(
              `Succesfull login on email: ${req.query.email}, password: ${req.query.password}`
            );
            client.close();
          }
        }
      });
  });
});

app.get("/signin", (req, res) => {
  // Sprawdzenie czy dany email jest juz w bazie, jesli nie ma to zarejestruj a jesli jest to nie
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);

    const db = client.db("wastepuff");
    db.collection("users")
      .find({ email: req.query.email })
      .toArray((err, result) => {
        if (isEmpty(result)) {
          // Gdy nie znaleziono zadnego uzytkownika z takim emailem \/
          db.collection("users")
            .insertOne({ email: req.query.email, password: req.query.password })
            .then(() => {
              res.status(200);
              res.send(`User registered ;) Refresh page`);
              log(`User: ${req.query.email} registered with password: ${req.query.password}`)
              client.close();
            });
        } else {
          // Gdy znaleziono chocia jeden rekord \/
          res.status(300);
          res.send(`User with that email already exist :c`);
          log(`FAILED REGISTER ON EMAIL: ${req.query.email}, PASSWORD: ${req.query.password}`)
          client.close();
        }
      });
  });
});
// https
//   .createServer(
//     {
//       key: fs.readFileSync("./key.pem"),
//       cert: fs.readFileSync("./cert.pem"),
//       passphrase: "HARA11",
//     },
//     app
//   )

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
