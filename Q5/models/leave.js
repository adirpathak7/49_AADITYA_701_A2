const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    date: Date,
    reason: String,
    granted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Leave', leaveSchema);
