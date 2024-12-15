const mongoose = require('mongoose');
const { create } = require('./user');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createAt : {
        type: Date,
        default: Date.now(),
    },
    uppdateAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Blog', blogSchema);