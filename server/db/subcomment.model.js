const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SubCommentSchema = new Schema({
    text: {type: String, required: true},
    userID: {type: String, required: true},
    targetID: {type: String, required: true},
    parentID: {type: String, required: true},
    img: {type: String, required: false},
}, { timestamps: true });


module.exports = mongoose.model('Linkedin-Sub-Comments', SubCommentSchema);