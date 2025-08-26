const express = require("express");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.render("form", { errors: [], old: {} });
});

app.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "otherPics" }
  ]),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("email").isEmail().withMessage("Invalid email"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("hobbies").custom((value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        throw new Error("Select at least one hobby");
      }
      return true;
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("form", { errors: errors.array(), old: req.body });
    }

    // Handle file uploads
    const profilePic = req.files["profilePic"]
      ? req.files["profilePic"][0].filename
      : null;
    const otherPics = req.files["otherPics"]
      ? req.files["otherPics"].map((file) => file.filename)
      : [];

    // Ensure hobbies is always array
    const hobbies = Array.isArray(req.body.hobbies)
      ? req.body.hobbies
      : [req.body.hobbies];

    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies,
      profilePic,
      otherPics
    };

    // Write to file
    const filePath = path.join(
      __dirname,
      "public",
      "uploads",
      `${req.body.username}-data.txt`
    );
    const fileContent = `
Username: ${userData.username}
Email: ${userData.email}
Gender: ${userData.gender}
Hobbies: ${userData.hobbies.join(", ")}
Profile Pic: ${profilePic}
Other Pics: ${otherPics.join(", ")}
`;
    fs.writeFileSync(filePath, fileContent);

    res.render("result", { user: userData, file: `${req.body.username}-data.txt` });
  }
);

app.get("/download/:filename", (req, res) => {
  const file = path.join(__dirname, "public", "uploads", req.params.filename);
  res.download(file);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
