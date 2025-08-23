const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    description: String,
    image: String
});

module.exports = mongoose.model('Product', ProductSchema);