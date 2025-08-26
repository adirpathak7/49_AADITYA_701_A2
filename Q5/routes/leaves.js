const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// function authenticate(req, res, next) {
//     try{
//         const token = req.headers.authorization?.split(' ')[1];
//         if(!token) return res.status(401).json( { error: 'No Token Provided!' });
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.id;
//         next();
//     }catch{
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// }

router.post("/", auth, async (req, res) => {
  const { date, reason } = req.body;
  if (!date || !reason)
    return res.status(400).json({ message: "Date and reason required" });

  const leave = await Leave.create({
    employee: req.employee.id,
    date: new Date(date),
    reason,
    granted: false,
  });

  res.status(201).json(leave);
});

router.get("/", auth, async (req, res) => {
  const Leaves = await Leave.find({ employeeId: req.userId }).sort({ createdAt: -1 });
  res.json(Leaves);
});

module.exports = router;