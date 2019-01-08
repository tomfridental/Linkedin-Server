const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: {type: String, required: true},
    allowComments: {type: Boolean, required: true},
    userID: {type: String, required: true},
    viewBy: {type: String, required: true},
    img: {type: String, required: false},
}, { timestamps: true });


module.exports = mongoose.model('linkedin-posts', PostSchema);
