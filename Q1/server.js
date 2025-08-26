// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const path = require('path');
// const { error } = require('console');

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.set('view engine', 'ejs');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Append extension
//   }     
// });

// const upload = multer({ storage });

// // const upload = multer({ 
// //     storage: storage ,
// //     limits: { fileSize: 1000000 }, // Limit file size to 1MB
// //     fileFilter: function (req, file, cb) {  
// //         const ext = path.extname(file.originalname).toLowerCase();
// //         if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
// //             return cb(null, true); // Accept file
// //         }
// //         else {
// //             cb(new Error('Only images are allowed'));
// //         }
// //     }
// // });

// app.get('/', (req, res) => {
//   res.render('form',{errors: [], old: {} });
// });

// app.post('/register', 
//     upload.fields([{name : "profilePic", maxCount : 1},{name : "otherPics", maxCount : 5}]), (req, res) => {
//     let {username, password, confirmPassword, email, gender, hobbies } = req.body;
//     // let error = {};
//     // let formData = { username, password, confirmPassword, email, gender, hobbies};
//     let error = {};
//     let formData = req.body || {};

//     if(!username || username.trim() === '') {
//         error.username = 'Username is required';
//     }
//     if(!password) {
//         error.password = 'Password is required';
//     }
//     if(password !== confirmPassword) {
//         error.confirmPassword = 'Passwords do not match';
//     }
//     if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         error.email = 'Valid email is required';
//     }
//     if(!gender) {
//         error.gender = "Gender is required";
//     }
//     if(!hobbies) {
//         error.hobbies = "At least one hobby is required";
//     }
//     if(!req.files["profilePic"]) {
//         error.profilePic = "Profile picture is required";
//     }
//     if(!req.files["otherPics"]) {
//         error.profilePic = "Profile picture is required";
//     }

//     if(Object.keys(error).length > 0) {
//         return res.render('form', { error, formData });
//     }

//     res.render('result', { 
//         formData, 
//         profilePic: req.files["profilePic"][0].filename,
//         otherPics: req.files["otherPics"].map(file => file.filename)
//     });
// });

// app.use((err, req, res, next) => {
//     res.render('form', { 
//         error: { general: err.message }, 
//         formData: req.body || {}
//     }); 
// });

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });