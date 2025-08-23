const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const { body, validationResult } = require('express-validator')
const fs = require('fs')

const app = express()
const PORT = 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage })

app.get('/', (req, res) => {
    res.render('form', { errors: [], old: {} });
});
app.post(
    "/register",
    upload.fields([{ name: "profilePic", maxCount: 1 }, { name: "otherPics" }]),
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
        body("email").isEmail().withMessage("Invalid email"),
        body("gender").notEmpty().withMessage("Gender is required"),
        body("hobbies").isArray({ min: 1 }).withMessage("Select at least one hobby")
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("form", { errors: errors.array(), old: req.body });
        }

        const profilePic = req.files["profilePic"] ? req.files["profilePic"][0].filename : null;
        const otherPics = req.files["otherPics"] ? req.files["otherPics"].map(f => f.filename) : [];

        const userData = {
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            hobbies: req.body.hobbies,
            profilePic,
            otherPics
        };

        const filePath = path.join(__dirname, "public", "uploads", `${req.body.username}-data.txt`);
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

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});