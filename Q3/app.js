const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

const USER = {
  username: 'adi',
  password: 'adi',
};

app.use(
  session({
    store: new FileStore({}),
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  res.send(`
    <h2>Login Page</h2>
    <form method="POST" action="/login">
      <input name="username" type="text" placeholder="Username" required /></br>
      <input name="password" type="password" placeholder="Password" required /></br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect("/dashboard");
  }
  res.send('Invalid Credentials. <a href="/">Try Again.</a>');
});

function authMiddleware(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/");
}

app.get("/dashboard", authMiddleware, (req, res) => {
  res.send(`
    <h2>Welcome, ${req.session.user}</h2>
    <a href="/logout">Logout</a>
  `);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
