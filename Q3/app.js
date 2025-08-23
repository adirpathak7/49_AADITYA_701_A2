const express = require("express");
const session = require("express-session");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;
const path = require("path");

const app = express();
const redisClient = new Redis();
redisClient.connect().catch(console.error);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

const USER = {
  username: "akash",
  password: "12345",
};

app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("dashboard", { username: req.session.username });
  } else {
    res.render("login", { error: null });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});