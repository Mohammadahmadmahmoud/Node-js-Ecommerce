const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user_id : {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
})

let Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product