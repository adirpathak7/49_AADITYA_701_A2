const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    granted: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);