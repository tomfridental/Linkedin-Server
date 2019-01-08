const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    targetID: {type: String, required: true},
    userID: {type: String, required: true},
    targetClass: {type: String, required: true}
}, { timestamps: true });


module.exports = mongoose.model('linkedin-likes', LikeSchema);
