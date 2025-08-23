const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");

const app = express();

// View engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session config
app.use(
  session({
    store: new FileStore({ path: "./sessions" }),
    secret: "secret-key-123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // 1 min for testing
  })
);

// Dummy credentials
const USER = {
  username: "akash",
  password: "12345",
};

// Routes

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect("/dashboard");
  } else {
    return res.render("login", { error: "Invalid username or password" });
  }
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("dashboard", { username: req.session.user });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
